import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Checkin, CheckinDocument } from './schemas/checkin.schema';

@Injectable()
export class CheckinsService {
  constructor(
    @InjectModel(Checkin.name) private checkinModel: Model<CheckinDocument>,
  ) { }

  async create(userId: string, data: { studiedToday: string; difficulties: string; nextSteps: string; hoursStudied: number; mood: string; productivityScore: number }) {
    const date = new Date().toISOString().split('T')[0];
    const existing = await this.checkinModel.findOne({ userId: new Types.ObjectId(userId), date });
    if (existing) throw new ConflictException('Check-in já realizado hoje');
    return this.checkinModel.create({ userId: new Types.ObjectId(userId), date, ...data });
  }

  async getToday(userId: string) {
    const date = new Date().toISOString().split('T')[0];
    return this.checkinModel.findOne({ userId: new Types.ObjectId(userId), date });
  }

  async getHistory(userId: string, days: number = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return this.checkinModel.find({
      userId: new Types.ObjectId(userId),
      createdAt: { $gte: since },
    }).sort({ date: -1 });
  }

  async getWeeklyReport(userId: string) {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const checkins = await this.checkinModel.find({
      userId: new Types.ObjectId(userId),
      createdAt: { $gte: since },
    });
    return {
      totalDays: checkins.length,
      totalHours: checkins.reduce((s, c) => s + c.hoursStudied, 0),
      avgProductivity: checkins.length ? Math.round(checkins.reduce((s, c) => s + c.productivityScore, 0) / checkins.length) : 0,
      moods: checkins.map(c => ({ date: c.date, mood: c.mood })),
      streak: checkins.length,
    };
  }

  async getStreak(userId: string): Promise<number> {
    const checkins = await this.checkinModel.find({ userId: new Types.ObjectId(userId) }).sort({ date: -1 }).limit(60);
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if (checkins.some(c => c.date === dateStr)) streak++;
      else break;
    }
    return streak;
  }
}
