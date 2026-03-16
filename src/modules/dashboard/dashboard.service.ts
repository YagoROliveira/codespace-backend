import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { UserTrackProgress, UserTrackProgressDocument } from '../tracks/schemas/user-track-progress.schema';
import { Session, SessionDocument } from '../sessions/schemas/session.schema';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';
import { StudyCronogram, StudyCronogramDocument } from '../admin/schemas/study-cronogram.schema';
import { Job, JobDocument } from '../jobs/schemas/job.schema';
import { Message, MessageDocument } from '../community/schemas/message.schema';
import { Checkin, CheckinDocument } from '../checkins/schemas/checkin.schema';
import { toBRDateStr } from '../../common/utils/date.util';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTrackProgress.name) private progressModel: Model<UserTrackProgressDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(StudyCronogram.name) private cronogramModel: Model<StudyCronogramDocument>,
    @InjectModel(Job.name) private jobModel: Model<JobDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Checkin.name) private checkinModel: Model<CheckinDocument>,
  ) { }

  async getDashboard(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const [
      user,
      activeTracks,
      upcomingSessions,
      totalSessions,
      completedTracks,
      cronogram,
      recentJobs,
      jobsCount,
      recentMessages,
      todayCheckin,
      weekCheckins,
    ] = await Promise.all([
      this.userModel.findById(userId)
        .select('name avatar plan streakDays totalHours')
        .lean().exec(),
      this.progressModel
        .find({ userId: userObjectId, status: 'in_progress' })
        .select('trackId progressPercent completedLessons startedAt lessonProgress')
        .populate('trackId', 'title slug lessons._id lessons.title lessons.durationMinutes')
        .lean().exec(),
      this.sessionModel
        .find({
          userId: userObjectId,
          scheduledAt: { $gte: now },
          status: 'scheduled',
        })
        .select('scheduledAt status mentorId topic')
        .sort({ scheduledAt: 1 })
        .limit(3)
        .populate('mentorId', 'name avatar')
        .lean().exec(),
      this.sessionModel.countDocuments({
        userId: userObjectId,
        status: 'completed',
      }),
      this.progressModel.countDocuments({
        userId: userObjectId,
        status: 'completed',
      }),
      this.cronogramModel.findOne({
        userId: userObjectId,
        status: { $in: ['active', 'draft'] },
      }).select('name dailyPlan dailyStudyHours weeklyStudyDays tracks')
        .lean().exec(),
      this.jobModel.find({ isActive: true })
        .select('title company companyLogo type level location salaryRange tags isFeatured isExclusive')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean().exec(),
      this.jobModel.countDocuments({ isActive: true }),
      this.messageModel.find()
        .select('content userId channelId createdAt')
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'name avatar role')
        .populate('channelId', 'name icon')
        .lean().exec(),
      this.checkinModel.findOne({
        userId: userObjectId,
        date: todayStart.toISOString().split('T')[0],
      }).select('mood hoursStudied productivityScore')
        .lean().exec(),
      this.checkinModel.find({
        userId: userObjectId,
        createdAt: { $gte: new Date(now.getTime() - 7 * 86400000) },
      }).select('hoursStudied productivityScore createdAt')
        .sort({ createdAt: -1 }).lean().exec(),
    ]);

    const inProgressTracks = activeTracks.map((progress) => ({
      track: progress.trackId,
      progressPercent: progress.progressPercent,
      completedLessons: progress.completedLessons,
      startedAt: progress.startedAt,
    }));

    // Build today's plan from cronogram
    let todayPlan: any[] = [];
    let cronogramSummary: any = null;
    let nextLesson: any = null;

    if (cronogram) {
      const todayStr = toBRDateStr(now);
      todayPlan = (cronogram.dailyPlan || [])
        .filter(item => toBRDateStr(new Date(item.date)) === todayStr)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // Cross-check completion from track progress
      const progressMap = new Map<string, Set<string>>();
      for (const tp of activeTracks) {
        const trackId = (tp.trackId as any)?._id?.toString() || tp.trackId?.toString();
        const completed = new Set(
          (tp.lessonProgress || [])
            .filter(lp => lp.completed)
            .map(lp => lp.lessonId.toString()),
        );
        if (trackId) progressMap.set(trackId, completed);
      }

      todayPlan = todayPlan.map(item => {
        const tId = item.trackId?.toString();
        const lId = item.lessonId?.toString();
        const completedSet = tId ? progressMap.get(tId) : null;
        const isCompleted = item.completed || (completedSet && lId ? completedSet.has(lId) : false);
        return { ...item, completed: isCompleted };
      });

      const totalItems = (cronogram.dailyPlan || []).length;
      const completedItems = (cronogram.dailyPlan || []).filter(i => i.completed).length;

      cronogramSummary = {
        name: cronogram.name,
        overallProgress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
        totalItems,
        completedItems,
        dailyStudyHours: cronogram.dailyStudyHours,
        weeklyStudyDays: cronogram.weeklyStudyDays,
        tracksCount: cronogram.tracks?.length || 0,
      };

      // Find next uncompleted lesson from today or future
      const allPlan = (cronogram.dailyPlan || [])
        .filter(item => {
          return toBRDateStr(new Date(item.date)) >= todayStr && !item.completed;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || (a.order || 0) - (b.order || 0));

      if (allPlan.length > 0) {
        const next = allPlan[0];
        nextLesson = {
          trackId: next.trackId,
          lessonId: next.lessonId,
          title: next.title,
          estimatedMinutes: next.estimatedMinutes,
        };
      }
    }

    // If no cronogram next lesson, fallback to first in-progress track
    if (!nextLesson && activeTracks.length > 0) {
      const first = activeTracks[0];
      const track = first.trackId as any;
      if (track?.lessons?.length) {
        const completedIds = new Set(
          (first.lessonProgress || []).filter(lp => lp.completed).map(lp => lp.lessonId.toString()),
        );
        const nextL = track.lessons.find((l: any) => !completedIds.has(l._id.toString()));
        if (nextL) {
          nextLesson = {
            trackId: track._id,
            lessonId: nextL._id,
            title: nextL.title,
            estimatedMinutes: nextL.durationMinutes,
          };
        }
      }
    }

    // Weekly study stats from checkins
    const weeklyStudyHours = weekCheckins.reduce((sum, c) => sum + (c.hoursStudied || 0), 0);
    const avgProductivity = weekCheckins.length > 0
      ? Math.round(weekCheckins.reduce((sum, c) => sum + (c.productivityScore || 0), 0) / weekCheckins.length)
      : 0;

    return {
      user: {
        name: user?.name,
        avatar: user?.avatar,
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
        totalLessonsCompleted: activeTracks.reduce((sum, tp) => sum + (tp.completedLessons || 0), 0),
      },
      activeTracks: inProgressTracks,
      upcomingSessions,
      cronogram: cronogramSummary,
      todayPlan,
      nextLesson,
      recentJobs: recentJobs.map(j => ({
        _id: (j as any)._id,
        title: j.title,
        company: j.company,
        companyLogo: j.companyLogo,
        type: j.type,
        level: j.level,
        location: j.location,
        salaryRange: j.salaryRange,
        tags: j.tags?.slice(0, 3),
        isFeatured: j.isFeatured,
        isExclusive: j.isExclusive,
      })),
      jobsTotal: jobsCount,
      recentCommunity: recentMessages.map(m => ({
        _id: (m as any)._id,
        content: m.content?.substring(0, 120),
        user: m.userId,
        channel: m.channelId,
        createdAt: (m as any).createdAt,
      })),
      todayCheckin: todayCheckin ? {
        mood: todayCheckin.mood,
        hoursStudied: todayCheckin.hoursStudied,
        productivityScore: todayCheckin.productivityScore,
      } : null,
      weeklyStudy: {
        totalHours: weeklyStudyHours,
        avgProductivity,
        checkinsDone: weekCheckins.length,
      },
    };
  }
}
