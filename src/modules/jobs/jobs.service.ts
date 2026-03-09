import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job, JobDocument, JobApplication, JobApplicationDocument } from './schemas/job.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(JobApplication.name) private applicationModel: Model<JobApplicationDocument>,
  ) { }

  async findAll(filters?: { type?: string; level?: string; tag?: string }): Promise<JobDocument[]> {
    const query: any = { isActive: true };
    if (filters?.type) query.type = filters.type;
    if (filters?.level) query.level = filters.level;
    if (filters?.tag) query.tags = { $in: [filters.tag] };
    return this.jobModel.find(query).sort({ isFeatured: -1, createdAt: -1 });
  }

  async findById(id: string): Promise<JobDocument> {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Vaga não encontrada');
    return job;
  }

  async apply(userId: string, jobId: string, coverLetter?: string) {
    const existing = await this.applicationModel.findOne({
      userId: new Types.ObjectId(userId),
      jobId: new Types.ObjectId(jobId),
    });
    if (existing) throw new ConflictException('Você já se candidatou a esta vaga');

    const application = await this.applicationModel.create({
      userId: new Types.ObjectId(userId),
      jobId: new Types.ObjectId(jobId),
      coverLetter: coverLetter || '',
      status: 'applied',
      appliedAt: new Date(),
    });

    await this.jobModel.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });
    return application;
  }

  async getMyApplications(userId: string) {
    const apps = await this.applicationModel.find({ userId: new Types.ObjectId(userId) }).sort({ appliedAt: -1 });
    const jobIds = apps.map(a => a.jobId);
    const jobs = await this.jobModel.find({ _id: { $in: jobIds } });
    const jobMap = new Map(jobs.map(j => [j._id.toString(), j]));
    return apps.map(a => ({ ...a.toObject(), job: jobMap.get(a.jobId.toString()) }));
  }

  async getStats() {
    const total = await this.jobModel.countDocuments({ isActive: true });
    const exclusive = await this.jobModel.countDocuments({ isActive: true, isExclusive: true });
    const remote = await this.jobModel.countDocuments({ isActive: true, type: 'remote' });
    return { total, exclusive, remote };
  }
}
