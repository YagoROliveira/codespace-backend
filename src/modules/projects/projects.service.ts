import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument, UserProject, UserProjectDocument } from './schemas/project.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @InjectModel(UserProject.name) private userProjectModel: Model<UserProjectDocument>,
  ) { }

  async findAll(difficulty?: string): Promise<any[]> {
    const query: any = { isActive: true };
    if (difficulty) query.difficulty = difficulty;
    return this.projectModel.find(query).sort({ isFeatured: -1, createdAt: -1 }).lean();
  }

  async findById(id: string): Promise<any> {
    const p = await this.projectModel.findById(id).lean();
    if (!p) throw new NotFoundException('Projeto não encontrado');
    return p;
  }

  async startProject(userId: string, projectId: string) {
    const existing = await this.userProjectModel.findOne({ userId: new Types.ObjectId(userId), projectId: new Types.ObjectId(projectId) }).lean();
    if (existing) throw new ConflictException('Você já está participando deste projeto');
    await this.projectModel.findByIdAndUpdate(projectId, { $inc: { participants: 1 } });
    return this.userProjectModel.create({
      userId: new Types.ObjectId(userId),
      projectId: new Types.ObjectId(projectId),
      status: 'in_progress',
      startedAt: new Date(),
    });
  }

  async submitProject(userId: string, projectId: string, repoUrl: string, deployUrl?: string) {
    const up = await this.userProjectModel.findOne({ userId: new Types.ObjectId(userId), projectId: new Types.ObjectId(projectId) });
    if (!up) throw new NotFoundException('Progresso não encontrado');
    up.status = 'submitted';
    up.repoUrl = repoUrl;
    up.deployUrl = deployUrl || '';
    up.submittedAt = new Date();
    return up.save();
  }

  async getMyProjects(userId: string): Promise<any[]> {
    const ups = await this.userProjectModel.find({ userId: new Types.ObjectId(userId) }).sort({ startedAt: -1 }).lean();
    const projectIds = ups.map(u => u.projectId);
    const projects = await this.projectModel.find({ _id: { $in: projectIds } }).lean();
    const pMap = new Map(projects.map(p => [p._id.toString(), p]));
    return ups.map(u => ({ ...u, project: pMap.get(u.projectId.toString()) }));
  }

  async getUserStats(userId: string) {
    const stats = await this.userProjectModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          submitted: { $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] } },
        },
      },
    ]);

    const s = stats[0] || { total: 0, inProgress: 0, completed: 0, submitted: 0 };
    return { total: s.total, inProgress: s.inProgress, completed: s.completed, submitted: s.submitted };
  }
}
