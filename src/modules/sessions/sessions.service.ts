import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) { }

  async findByUser(userId: string): Promise<any[]> {
    return this.sessionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ scheduledAt: -1 })
      .populate('mentorId', 'name avatar')
      .lean().exec();
  }

  async findUpcoming(userId: string): Promise<any[]> {
    return this.sessionModel
      .find({
        userId: new Types.ObjectId(userId),
        scheduledAt: { $gte: new Date() },
        status: { $in: ['scheduled', 'in_progress'] },
      })
      .sort({ scheduledAt: 1 })
      .populate('mentorId', 'name avatar')
      .lean().exec();
  }

  async findPast(userId: string): Promise<any[]> {
    return this.sessionModel
      .find({
        userId: new Types.ObjectId(userId),
        $or: [
          { scheduledAt: { $lt: new Date() } },
          { status: 'completed' },
        ],
      })
      .sort({ scheduledAt: -1 })
      .populate('mentorId', 'name avatar')
      .lean().exec();
  }

  async findById(id: string): Promise<any> {
    const session = await this.sessionModel
      .findById(id)
      .populate('mentorId', 'name avatar')
      .lean().exec();
    if (!session) throw new NotFoundException('Sessão não encontrada');
    return session;
  }

  async create(userId: string, dto: CreateSessionDto): Promise<SessionDocument> {
    const session = new this.sessionModel({
      ...dto,
      userId: new Types.ObjectId(userId),
    });
    return session.save();
  }

  async update(id: string, dto: UpdateSessionDto): Promise<SessionDocument> {
    const session = await this.sessionModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!session) throw new NotFoundException('Sessão não encontrada');
    return session;
  }

  async cancel(id: string): Promise<SessionDocument> {
    return this.update(id, { status: 'cancelled' });
  }

  async getWeekSessions(userId: string): Promise<any[]> {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    return this.sessionModel
      .find({
        userId: new Types.ObjectId(userId),
        scheduledAt: { $gte: startOfWeek, $lt: endOfWeek },
      })
      .sort({ scheduledAt: 1 })
      .populate('mentorId', 'name avatar')
      .lean().exec();
  }
}
