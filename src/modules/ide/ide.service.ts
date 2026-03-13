import {
  Injectable,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { IdeContainer, IdeContainerDocument } from './schemas/ide-container.schema';

@Injectable()
export class IdeService {
  private readonly logger = new Logger(IdeService.name);

  private readonly portainerUrl: string;
  private readonly portainerApiKey: string;
  private readonly portainerEndpointId: string;
  private readonly ideDomain: string;
  private readonly ideNetwork: string;
  private readonly ideImage: string;
  private readonly ideCertResolver: string;

  constructor(
    @InjectModel(IdeContainer.name) private ideContainerModel: Model<IdeContainerDocument>,
    private configService: ConfigService,
  ) {
    this.portainerUrl = this.configService.get<string>('PORTAINER_URL', 'https://portainer.localhost');
    this.portainerApiKey = this.configService.get<string>('PORTAINER_API_KEY', '');
    this.portainerEndpointId = this.configService.get<string>('PORTAINER_ENDPOINT_ID', '1');
    this.ideDomain = this.configService.get<string>('IDE_DOMAIN', 'ide.codespace.dev.br');
    this.ideNetwork = this.configService.get<string>('IDE_NETWORK', 'network_public');
    this.ideImage = this.configService.get<string>('IDE_IMAGE', 'codercom/code-server:latest');
    this.ideCertResolver = this.configService.get<string>('IDE_CERT_RESOLVER', 'letsencryptresolver');
  }

  // ───── Portainer API helpers ─────

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.portainerApiKey,
    };
  }

  private get endpointBase() {
    return `${this.portainerUrl}/api/endpoints/${this.portainerEndpointId}/docker`;
  }

  private async portainerFetch(path: string, options: RequestInit = {}) {
    const url = `${this.endpointBase}${path}`;
    this.logger.debug(`Portainer request: ${options.method || 'GET'} ${url}`);
    const res = await fetch(url, { ...options, headers: { ...this.headers, ...options.headers } });
    if (!res.ok) {
      const text = await res.text();
      this.logger.error(`Portainer error ${res.status}: ${text}`);
      throw new InternalServerErrorException(`Portainer API error: ${res.status}`);
    }
    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return res.json();
    }
    return null;
  }

  // Variant that doesn't throw on error — returns null
  private async portainerFetchSafe(path: string, options: RequestInit = {}): Promise<any | null> {
    const url = `${this.endpointBase}${path}`;
    this.logger.debug(`Portainer request (safe): ${options.method || 'GET'} ${url}`);
    try {
      const res = await fetch(url, { ...options, headers: { ...this.headers, ...options.headers } });
      if (!res.ok) return null;
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) return res.json();
      return true;
    } catch {
      return null;
    }
  }

  // ───── Main public methods ─────

  async provisionIde(userId: string): Promise<IdeContainer> {
    userId = String(userId);
    const existing = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });

    if (existing) {
      if (existing.status === 'running') {
        existing.lastAccessedAt = new Date();
        await existing.save();
        return existing;
      }

      // Service exists but is stopped (0 replicas) — scale back to 1
      try {
        await this.scaleService(existing.serviceId, 1);
        existing.status = 'running';
        existing.lastAccessedAt = new Date();
        existing.stoppedAt = null;
        await existing.save();
        return existing;
      } catch (err) {
        this.logger.warn(`Failed to scale service ${existing.serviceName}, re-creating...`);
        try { await this.removeService(existing.serviceId); } catch { }
        await this.ideContainerModel.deleteOne({ _id: existing._id });
      }
    }

    return this.createService(userId);
  }

  async stopIde(userId: string): Promise<IdeContainer> {
    userId = String(userId);
    const record = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!record) throw new NotFoundException('Nenhum container IDE encontrado para este usuário');

    if (record.status === 'stopped') return record;

    try {
      await this.scaleService(record.serviceId, 0);
    } catch (err) {
      this.logger.warn(`Failed to scale down service ${record.serviceName}: ${err.message}`);
    }

    record.status = 'stopped';
    record.stoppedAt = new Date();
    await record.save();
    return record;
  }

  async getStatus(userId: string): Promise<IdeContainer | null> {
    userId = String(userId);
    const record = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!record) return null;

    // Sync status with Swarm service state
    try {
      const service = await this.inspectService(record.serviceId);
      if (!service) {
        record.status = 'error';
        await record.save();
        return record;
      }

      const replicas = service?.Spec?.Mode?.Replicated?.Replicas ?? 0;
      const tasks = await this.getServiceTasks(record.serviceId);
      const runningTask = tasks?.find((t: any) => t.Status?.State === 'running');

      if (replicas === 0) {
        record.status = 'stopped';
      } else if (runningTask) {
        record.status = 'running';
      } else {
        record.status = 'creating';
      }
      await record.save();
    } catch {
      record.status = 'error';
      await record.save();
    }

    return record;
  }

  async destroyIde(userId: string): Promise<void> {
    userId = String(userId);
    const record = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!record) throw new NotFoundException('Nenhum container IDE encontrado para este usuário');

    try { await this.removeService(record.serviceId); } catch { }
    await this.ideContainerModel.deleteOne({ _id: record._id });
  }

  async listAll(): Promise<IdeContainer[]> {
    return this.ideContainerModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  // ───── Swarm service lifecycle via Portainer Docker API ─────

  private async createService(userId: string): Promise<IdeContainer> {
    const shortId = userId.slice(-8);
    const serviceName = `ide-${shortId}`;
    const volumeName = `ide-data-${shortId}`;
    const subdomain = `ide-${shortId}`;

    const serviceSpec = {
      Name: serviceName,
      Labels: {
        // Traefik routing labels (read by Traefik in swarmMode)
        'traefik.enable': 'true',
        [`traefik.http.routers.${serviceName}.rule`]: `Host(\`${subdomain}.${this.ideDomain}\`)`,
        [`traefik.http.routers.${serviceName}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${serviceName}.tls.certresolver`]: this.ideCertResolver,
        [`traefik.http.services.${serviceName}.loadbalancer.server.port`]: '8080',
        // Metadata
        'codespace.managed': 'true',
        'codespace.userId': userId,
      },
      TaskTemplate: {
        ContainerSpec: {
          Image: this.ideImage,
          Args: ['--auth', 'none'],
          Env: [
            'DEFAULT_WORKSPACE=/home/coder/project',
          ],
          Mounts: [
            {
              Type: 'volume',
              Source: volumeName,
              Target: '/home/coder/project',
            },
          ],
        },
        Resources: {
          Limits: {
            MemoryBytes: 1073741824, // 1GB
            NanoCPUs: 1000000000,    // 1 CPU
          },
        },
        RestartPolicy: {
          Condition: 'on-failure',
          MaxAttempts: 3,
        },
        Networks: [{ Target: this.ideNetwork }],
      },
      Mode: {
        Replicated: { Replicas: 1 },
      },
    };

    this.logger.log(`Creating IDE service "${serviceName}" for user ${userId}`);

    const result = await this.portainerFetch('/services/create', {
      method: 'POST',
      body: JSON.stringify(serviceSpec),
    });

    const serviceId = result.ID;
    const url = `https://${subdomain}.${this.ideDomain}`;

    const record = await this.ideContainerModel.create({
      userId: new Types.ObjectId(userId),
      serviceId,
      serviceName,
      containerId: '',
      containerName: serviceName,
      url,
      password: '',
      status: 'running',
      lastAccessedAt: new Date(),
    });

    this.logger.log(`IDE service created: ${serviceName} (${serviceId}) → ${url}`);
    return record;
  }

  private async scaleService(serviceId: string, replicas: number): Promise<void> {
    // Get current service spec + version
    const service = await this.portainerFetch(`/services/${serviceId}`);
    const version = service.Version.Index;
    const spec = service.Spec;

    // Update replicas
    spec.Mode.Replicated.Replicas = replicas;

    await this.portainerFetch(`/services/${serviceId}/update?version=${version}`, {
      method: 'POST',
      body: JSON.stringify(spec),
    });

    this.logger.log(`Scaled service ${serviceId} to ${replicas} replicas`);
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
