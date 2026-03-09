import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserTrackProgress, UserTrackProgressDocument } from '../tracks/schemas/user-track-progress.schema';
import { Session, SessionDocument } from '../sessions/schemas/session.schema';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTrackProgress.name) private progressModel: Model<UserTrackProgressDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) { }

  async getDashboard(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    const [user, activeTracks, upcomingSessions, totalSessions] = await Promise.all([
      this.userModel.findById(userId).exec(),
      this.progressModel
        .find({ userId: userObjectId, status: 'in_progress' })
        .populate('trackId')
        .exec(),
      this.sessionModel
        .find({
          userId: userObjectId,
          scheduledAt: { $gte: new Date() },
          status: 'scheduled',
        })
        .sort({ scheduledAt: 1 })
        .limit(3)
        .populate('mentorId', 'name avatar')
        .exec(),
      this.sessionModel.countDocuments({
        userId: userObjectId,
        status: 'completed',
      }),
    ]);

    const completedTracks = await this.progressModel.countDocuments({
      userId: userObjectId,
      status: 'completed',
    });

    const inProgressTracks = activeTracks.map((progress) => ({
      track: progress.trackId,
      progressPercent: progress.progressPercent,
      completedLessons: progress.completedLessons,
      startedAt: progress.startedAt,
    }));

    return {
      user: {
        name: user?.name,
        plan: user?.plan,
        streakDays: user?.streakDays || 0,
        totalHours: user?.totalHours || 0,
      },
      stats: {
        activeTracks: activeTracks.length,
        completedTracks,
        totalHours: user?.totalHours || 0,
        totalSessions,
        streakDays: user?.streakDays || 0,
      },
      activeTracks: inProgressTracks,
      upcomingSessions,
    };
  }
}
