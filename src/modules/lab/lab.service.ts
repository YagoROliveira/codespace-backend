import {
  Injectable, Logger, NotFoundException, ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Interval } from '@nestjs/schedule';
import { LabEnvironment, LabEnvironmentDocument } from './schemas/lab-environment.schema';
import { LabExercise, LabExerciseDocument } from './schemas/lab-exercise.schema';

@Injectable()
export class LabService {
  private readonly logger = new Logger(LabService.name);

  private readonly portainerUrl: string;
  private readonly portainerApiKey: string;
  private readonly labEndpointId: string;
  private readonly labDomain: string;
  private readonly labNetwork: string;
  private readonly labImage: string;
  private readonly labCertResolver: string;
  private readonly labIdleTimeoutMs: number;

  constructor(
    @InjectModel(LabEnvironment.name) private labEnvModel: Model<LabEnvironmentDocument>,
    @InjectModel(LabExercise.name) private labExerciseModel: Model<LabExerciseDocument>,
    private configService: ConfigService,
  ) {
    this.portainerUrl = this.configService.get<string>('PORTAINER_URL', 'https://portal.aggres.com.br');
    this.portainerApiKey = this.configService.get<string>('PORTAINER_API_KEY', '');
    this.labEndpointId = this.configService.get<string>('LAB_PORTAINER_ENDPOINT_ID', '2');
    this.labDomain = this.configService.get<string>('LAB_DOMAIN', 'lab.codespace.com.br');
    this.labNetwork = this.configService.get<string>('LAB_NETWORK', 'network_public');
    this.labImage = this.configService.get<string>('LAB_IMAGE', 'codespace-lab:latest');
    this.labCertResolver = this.configService.get<string>('LAB_CERT_RESOLVER', 'letsencryptresolver');
    this.labIdleTimeoutMs = parseInt(
      this.configService.get<string>('LAB_IDLE_TIMEOUT', '3600000'), 10,
    );
  }

  // ───── Portainer Docker API helpers (targets Lab server endpoint) ─────

  private async portainerFetch(path: string, init: RequestInit = {}): Promise<any> {
    const url = `${this.portainerUrl}/api/endpoints/${this.labEndpointId}/docker${path}`;
    const res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.portainerApiKey,
        ...(init.headers || {}),
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Portainer Lab API ${res.status}: ${body}`);
    }
    return res.json();
  }

  private async portainerFetchSafe(path: string, init: RequestInit = {}): Promise<any | null> {
    try {
      return await this.portainerFetch(path, init);
    } catch {
      return null;
    }
  }

  // ───── Lab Environment lifecycle ─────

  async provisionLab(userId: string, labType: string): Promise<LabEnvironment> {
    userId = String(userId);
    const validTypes = ['docker', 'kubernetes', 'cicd', 'monitoring', 'fullstack'];
    if (!validTypes.includes(labType)) {
      throw new ConflictException(`Tipo de lab inválido: ${labType}`);
    }

    let record = await this.labEnvModel.findOne({
      userId: new Types.ObjectId(userId), labType,
    });

    if (record) {
      if (record.status === 'running') return record;
      if (record.status === 'stopped') {
        // Restart existing service
        await this.scaleService(record.serviceId, 1);
        record.status = 'running';
        record.stoppedAt = null;
        record.lastAccessedAt = new Date();
        await record.save();
        return record;
      }
      // Error state — destroy and recreate
      try { await this.removeService(record.serviceId); } catch { }
      await this.labEnvModel.deleteOne({ _id: record._id });
    }

    return this.createLabService(userId, labType);
  }

  async stopLab(userId: string, labType: string): Promise<LabEnvironment> {
    userId = String(userId);
    const record = await this.labEnvModel.findOne({
      userId: new Types.ObjectId(userId), labType,
    });
    if (!record) throw new NotFoundException('Nenhum lab encontrado');
    if (record.status === 'stopped') return record;

    try {
      await this.scaleService(record.serviceId, 0);
    } catch (err) {
      this.logger.warn(`Failed to stop lab ${record.serviceName}: ${err.message}`);
    }

    record.status = 'stopped';
    record.stoppedAt = new Date();
    await record.save();
    return record;
  }

  async destroyLab(userId: string, labType: string): Promise<void> {
    userId = String(userId);
    const record = await this.labEnvModel.findOne({
      userId: new Types.ObjectId(userId), labType,
    });
    if (!record) throw new NotFoundException('Nenhum lab encontrado');
    try { await this.removeService(record.serviceId); } catch { }
    await this.labEnvModel.deleteOne({ _id: record._id });
  }

  async getLabStatus(userId: string, labType?: string): Promise<LabEnvironment[]> {
    userId = String(userId);
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (labType) filter.labType = labType;
    const records = await this.labEnvModel.find(filter).lean().exec();

    // Sync status with Docker
    for (const record of records) {
      try {
        const service = await this.inspectService(record.serviceId);
        if (!service) {
          await this.labEnvModel.updateOne({ _id: record._id }, { status: 'error' });
          (record as any).status = 'error';
          continue;
        }
        const replicas = service?.Spec?.Mode?.Replicated?.Replicas ?? 0;
        const tasks = await this.getServiceTasks(record.serviceId);
        const runningTask = tasks?.find((t: any) => t.Status?.State === 'running');

        let newStatus = record.status;
        if (replicas === 0) newStatus = 'stopped';
        else if (runningTask) newStatus = 'running';
        else newStatus = 'creating';

        if (newStatus !== record.status) {
          await this.labEnvModel.updateOne({ _id: record._id }, { status: newStatus });
          (record as any).status = newStatus;
        }
      } catch {
        await this.labEnvModel.updateOne({ _id: record._id }, { status: 'error' });
        (record as any).status = 'error';
      }
    }

    return records;
  }

  async heartbeat(userId: string, labType: string): Promise<void> {
    userId = String(userId);
    await this.labEnvModel.updateOne(
      { userId: new Types.ObjectId(userId), labType, status: 'running' },
      { $set: { lastAccessedAt: new Date() } },
    );
  }

  // ───── Exercises CRUD ─────

  async listExercises(labType?: string): Promise<LabExercise[]> {
    const filter: any = { isActive: true };
    if (labType) filter.labType = labType;
    return this.labExerciseModel.find(filter).sort({ labType: 1, order: 1 }).lean().exec();
  }

  async getExercise(id: string): Promise<LabExercise> {
    const exercise = await this.labExerciseModel.findById(id).lean().exec();
    if (!exercise) throw new NotFoundException('Exercício não encontrado');
    return exercise;
  }

  async createExercise(data: Partial<LabExercise>): Promise<LabExercise> {
    return this.labExerciseModel.create(data);
  }

  async updateExercise(id: string, data: Partial<LabExercise>): Promise<LabExercise> {
    const exercise = await this.labExerciseModel.findByIdAndUpdate(id, data, { new: true }).lean().exec();
    if (!exercise) throw new NotFoundException('Exercício não encontrado');
    return exercise;
  }

  async deleteExercise(id: string): Promise<void> {
    await this.labExerciseModel.findByIdAndDelete(id);
  }

  async completeExercise(userId: string, labType: string, exerciseId: string): Promise<LabEnvironment> {
    userId = String(userId);
    const record = await this.labEnvModel.findOne({
      userId: new Types.ObjectId(userId), labType,
    });
    if (!record) throw new NotFoundException('Nenhum lab encontrado');

    const eid = new Types.ObjectId(exerciseId);
    if (!record.completedExercises.some(e => e.equals(eid))) {
      record.completedExercises.push(eid);
    }
    record.currentExerciseId = null;
    await record.save();
    return record;
  }

  async startExercise(userId: string, labType: string, exerciseId: string): Promise<LabEnvironment> {
    userId = String(userId);
    const record = await this.labEnvModel.findOne({
      userId: new Types.ObjectId(userId), labType,
    });
    if (!record) throw new NotFoundException('Nenhum lab encontrado');
    record.currentExerciseId = new Types.ObjectId(exerciseId);
    await record.save();
    return record;
  }

  // ───── Admin ─────

  async listAllLabs(): Promise<LabEnvironment[]> {
    return this.labEnvModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async adminProvision(userId: string, labType: string): Promise<LabEnvironment> {
    return this.provisionLab(userId, labType);
  }

  async adminStop(userId: string, labType: string): Promise<LabEnvironment> {
    return this.stopLab(userId, labType);
  }

  async adminDestroy(userId: string, labType: string): Promise<void> {
    return this.destroyLab(userId, labType);
  }

  // ───── Auto-shutdown idle labs (runs every 5 minutes) ─────

  @Interval(5 * 60 * 1000)
  async handleIdleShutdown(): Promise<void> {
    const cutoff = new Date(Date.now() - this.labIdleTimeoutMs);
    const idleLabs = await this.labEnvModel.find({
      status: 'running',
      lastAccessedAt: { $lt: cutoff },
    });

    if (idleLabs.length === 0) return;

    this.logger.log(`Found ${idleLabs.length} idle lab(s) — shutting down...`);

    for (const record of idleLabs) {
      try {
        await this.scaleService(record.serviceId, 0);
        record.status = 'stopped';
        record.stoppedAt = new Date();
        await record.save();
        this.logger.log(`Auto-stopped idle lab: ${record.serviceName} (user ${record.userId})`);
      } catch (err) {
        this.logger.error(`Failed to auto-stop lab ${record.serviceName}: ${err.message}`);
      }
    }
  }

  // ───── Docker Swarm service management via Portainer ─────

  private async createLabService(userId: string, labType: string): Promise<LabEnvironment> {
    const shortId = userId.slice(-8);
    const serviceName = `lab-${labType}-${shortId}`;
    const volumeName = `lab-${labType}-data-${shortId}`;
    const subdomain = `lab-${labType}-${shortId}`;

    // Build environment and resources based on lab type
    const { env, mounts, resources, ports } = this.getLabTypeConfig(labType, volumeName);

    const serviceSpec = {
      Name: serviceName,
      Labels: {
        'traefik.enable': 'true',
        [`traefik.http.routers.${serviceName}.rule`]: `Host(\`${subdomain}.${this.labDomain}\`)`,
        [`traefik.http.routers.${serviceName}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${serviceName}.tls.certresolver`]: this.labCertResolver,
        [`traefik.http.services.${serviceName}.loadbalancer.server.port`]: String(ports.web),
        'codespace.managed': 'true',
        'codespace.lab': 'true',
        'codespace.labType': labType,
        'codespace.userId': userId,
      },
      TaskTemplate: {
        ContainerSpec: {
          Image: this.labImage,
          Env: env,
          Mounts: mounts,
          // DinD needs privileged mode
          Privileges: labType === 'docker' || labType === 'fullstack' || labType === 'cicd'
            ? { NoNewPrivileges: false }
            : undefined,
          // Docker socket mount for DinD types
          ...(labType === 'docker' || labType === 'fullstack' || labType === 'cicd'
            ? {}
            : {}
          ),
        },
        Resources: {
          Limits: resources,
        },
        RestartPolicy: {
          Condition: 'on-failure',
          MaxAttempts: 3,
        },
        Networks: [{ Target: this.labNetwork }],
      },
      Mode: {
        Replicated: { Replicas: 1 },
      },
    };

    this.logger.log(`Creating lab service "${serviceName}" (${labType}) for user ${userId}`);

    const result = await this.portainerFetch('/services/create', {
      method: 'POST',
      body: JSON.stringify(serviceSpec),
    });

    const serviceId = result.ID;
    const url = `https://${subdomain}.${this.labDomain}`;

    const record = await this.labEnvModel.create({
      userId: new Types.ObjectId(userId),
      serviceId,
      serviceName,
      labType,
      url,
      status: 'running',
      lastAccessedAt: new Date(),
      metadata: { volumeName, subdomain, ports },
    });

    this.logger.log(`Lab service created: ${serviceName} (${serviceId}) → ${url}`);
    return record;
  }

  private getLabTypeConfig(labType: string, volumeName: string) {
    const baseEnv = [
      `LAB_TYPE=${labType}`,
    ];

    // Common volume mount for persistent data
    const baseMounts = [
      {
        Type: 'volume' as const,
        Source: volumeName,
        Target: '/home/coder/workspace',
      },
    ];

    switch (labType) {
      case 'docker':
        return {
          env: [
            ...baseEnv,
            'DOCKER_IN_DOCKER=true',
          ],
          mounts: [
            ...baseMounts,
            // Docker socket for DinD
            { Type: 'bind' as const, Source: '/var/run/docker.sock', Target: '/var/run/docker.sock' },
          ],
          resources: {
            MemoryBytes: 2147483648, // 2GB
            NanoCPUs: 2000000000,    // 2 CPU
          },
          ports: { web: 7681 }, // ttyd port
        };

      case 'kubernetes':
        return {
          env: [
            ...baseEnv,
            'K8S_LAB=true',
          ],
          mounts: baseMounts,
          resources: {
            MemoryBytes: 3221225472, // 3GB
            NanoCPUs: 2000000000,    // 2 CPU
          },
          ports: { web: 7681 },
        };

      case 'cicd':
        return {
          env: [
            ...baseEnv,
            'CICD_LAB=true',
            'DOCKER_IN_DOCKER=true',
          ],
          mounts: [
            ...baseMounts,
            { Type: 'bind' as const, Source: '/var/run/docker.sock', Target: '/var/run/docker.sock' },
          ],
          resources: {
            MemoryBytes: 2147483648, // 2GB
            NanoCPUs: 2000000000,    // 2 CPU
          },
          ports: { web: 7681 },
        };

      case 'monitoring':
        return {
          env: [
            ...baseEnv,
            'MONITORING_LAB=true',
          ],
          mounts: baseMounts,
          resources: {
            MemoryBytes: 2147483648, // 2GB
            NanoCPUs: 1000000000,    // 1 CPU
          },
          ports: { web: 7681 },
        };

      case 'fullstack':
      default:
        return {
          env: [
            ...baseEnv,
            'DOCKER_IN_DOCKER=true',
            'K8S_LAB=true',
            'CICD_LAB=true',
            'MONITORING_LAB=true',
          ],
          mounts: [
            ...baseMounts,
            { Type: 'bind' as const, Source: '/var/run/docker.sock', Target: '/var/run/docker.sock' },
          ],
          resources: {
            MemoryBytes: 4294967296, // 4GB
            NanoCPUs: 3000000000,    // 3 CPU
          },
          ports: { web: 7681 },
        };
    }
  }

  private async scaleService(serviceId: string, replicas: number): Promise<void> {
    const service = await this.portainerFetch(`/services/${serviceId}`);
    const version = service.Version.Index;
    const spec = service.Spec;
    spec.Mode.Replicated.Replicas = replicas;

    await this.portainerFetch(`/services/${serviceId}/update?version=${version}`, {
      method: 'POST',
      body: JSON.stringify(spec),
    });
    this.logger.log(`Scaled lab service ${serviceId} to ${replicas} replicas`);
  }

  private async removeService(serviceId: string): Promise<void> {
    await this.portainerFetch(`/services/${serviceId}`, { method: 'DELETE' });
  }

  private async inspectService(serviceId: string): Promise<any> {
    return this.portainerFetchSafe(`/services/${serviceId}`);
  }

  private async getServiceTasks(serviceId: string): Promise<any[]> {
    const filters = JSON.stringify({ service: [serviceId] });
    return (await this.portainerFetchSafe(`/tasks?filters=${encodeURIComponent(filters)}`)) || [];
  }
}
