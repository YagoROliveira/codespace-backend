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
import { randomBytes } from 'crypto';

@Injectable()
export class IdeService {
  private readonly logger = new Logger(IdeService.name);

  private readonly portainerUrl: string;
  private readonly portainerApiKey: string;
  private readonly portainerEndpointId: string;
  private readonly ideDomain: string;
  private readonly ideNetwork: string;
  private readonly ideImage: string;

  constructor(
    @InjectModel(IdeContainer.name) private ideContainerModel: Model<IdeContainerDocument>,
    private configService: ConfigService,
  ) {
    this.portainerUrl = this.configService.get<string>('PORTAINER_URL', 'https://portainer.localhost');
    this.portainerApiKey = this.configService.get<string>('PORTAINER_API_KEY', '');
    this.portainerEndpointId = this.configService.get<string>('PORTAINER_ENDPOINT_ID', '1');
    this.ideDomain = this.configService.get<string>('IDE_DOMAIN', 'ide.codespace.dev.br');
    this.ideNetwork = this.configService.get<string>('IDE_NETWORK', 'traefik-public');
    this.ideImage = this.configService.get<string>('IDE_IMAGE', 'codercom/code-server:latest');
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

  // ───── Main public methods ─────

  /**
   * Provision or start an IDE container for a user.
   * If the container already exists and is stopped, start it.
   * If it doesn't exist, create a new one.
   */
  async provisionIde(userId: string): Promise<IdeContainer> {
    const existing = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });

    if (existing) {
      // Container record exists — try to start if stopped
      if (existing.status === 'running') {
        existing.lastAccessedAt = new Date();
        await existing.save();
        return existing;
      }

      try {
        await this.startContainer(existing.containerId);
        existing.status = 'running';
        existing.lastAccessedAt = new Date();
        existing.stoppedAt = null;
        await existing.save();
        return existing;
      } catch (err) {
        this.logger.warn(`Failed to start existing container ${existing.containerId}, re-creating...`);
        // Remove old container and re-create
        try {
          await this.removeContainer(existing.containerId);
        } catch { }
        await this.ideContainerModel.deleteOne({ _id: existing._id });
      }
    }

    // Create new container
    return this.createContainer(userId);
  }

  /**
   * Stop the IDE container for a user.
   */
  async stopIde(userId: string): Promise<IdeContainer> {
    const record = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!record) throw new NotFoundException('Nenhum container IDE encontrado para este usuário');

    if (record.status === 'stopped') return record;

    try {
      await this.stopContainer(record.containerId);
    } catch (err) {
      this.logger.warn(`Failed to stop container ${record.containerId}: ${err.message}`);
    }

    record.status = 'stopped';
    record.stoppedAt = new Date();
    await record.save();
    return record;
  }

  /**
   * Get IDE status for a user.
   */
  async getStatus(userId: string): Promise<IdeContainer | null> {
    const record = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!record) return null;

    // Sync status with Portainer
    try {
      const info = await this.inspectContainer(record.containerId);
      const running = info?.State?.Running;
      const newStatus = running ? 'running' : 'stopped';

      if (record.status !== newStatus) {
        record.status = newStatus;
        await record.save();
      }
    } catch {
      // Container may have been removed externally
      record.status = 'error';
      await record.save();
    }

    return record;
  }

  /**
   * Remove the IDE container completely for a user (admin action).
   */
  async destroyIde(userId: string): Promise<void> {
    const record = await this.ideContainerModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!record) throw new NotFoundException('Nenhum container IDE encontrado para este usuário');

    try {
      await this.stopContainer(record.containerId);
    } catch { }

    try {
      await this.removeContainer(record.containerId);
    } catch { }

    await this.ideContainerModel.deleteOne({ _id: record._id });
  }

  /**
   * List all IDE containers (admin).
   */
  async listAll(): Promise<IdeContainer[]> {
    return this.ideContainerModel.find().sort({ createdAt: -1 }).exec();
  }

  // ───── Container lifecycle via Portainer Docker API ─────

  private async createContainer(userId: string): Promise<IdeContainer> {
    const shortId = userId.slice(-8);
    const containerName = `ide-${shortId}`;
    const volumeName = `ide-data-${shortId}`;
    const subdomain = `ide-${shortId}`;
    const password = randomBytes(16).toString('hex');

    const containerConfig = {
      Image: this.ideImage,
      Env: [
        `PASSWORD=${password}`,
        'DEFAULT_WORKSPACE=/home/coder/project',
      ],
      ExposedPorts: { '8080/tcp': {} },
      HostConfig: {
        Binds: [`${volumeName}:/home/coder/project`],
        RestartPolicy: { Name: 'unless-stopped' },
        Memory: 1073741824, // 1GB
        NanoCpus: 1000000000, // 1 CPU
      },
      Labels: {
        // Traefik routing labels
        'traefik.enable': 'true',
        [`traefik.http.routers.${containerName}.rule`]: `Host(\`${subdomain}.${this.ideDomain}\`)`,
        [`traefik.http.routers.${containerName}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${containerName}.tls.certresolver`]: 'letsencrypt',
        [`traefik.http.services.${containerName}.loadbalancer.server.port`]: '8080',
        // Metadata
        'codespace.managed': 'true',
        'codespace.userId': userId,
      },
      NetworkingConfig: {
        EndpointsConfig: {
          [this.ideNetwork]: {},
        },
      },
    };

    this.logger.log(`Creating IDE container "${containerName}" for user ${userId}`);

    // Pull image (ignore if already present)
    try {
      await this.portainerFetch(`/images/create?fromImage=${encodeURIComponent(this.ideImage)}`, {
        method: 'POST',
      });
    } catch {
      this.logger.warn('Image pull failed — image may already exist locally');
    }

    // Create container
    const createResult = await this.portainerFetch(
      `/containers/create?name=${containerName}`,
      {
        method: 'POST',
        body: JSON.stringify(containerConfig),
      },
    );

    const containerId = createResult.Id;

    // Start container
    await this.startContainer(containerId);

    const url = `https://${subdomain}.${this.ideDomain}`;

    const record = await this.ideContainerModel.create({
      userId: new Types.ObjectId(userId),
      containerId,
      containerName,
      url,
      password,
      status: 'running',
      lastAccessedAt: new Date(),
    });

    this.logger.log(`IDE container created: ${containerName} (${containerId}) → ${url}`);
    return record;
  }

  private async startContainer(containerId: string): Promise<void> {
    await this.portainerFetch(`/containers/${containerId}/start`, { method: 'POST' });
  }

  private async stopContainer(containerId: string): Promise<void> {
    await this.portainerFetch(`/containers/${containerId}/stop`, { method: 'POST' });
  }

  private async removeContainer(containerId: string): Promise<void> {
    await this.portainerFetch(`/containers/${containerId}?force=true`, { method: 'DELETE' });
  }

  private async inspectContainer(containerId: string): Promise<any> {
    return this.portainerFetch(`/containers/${containerId}/json`);
  }
}
