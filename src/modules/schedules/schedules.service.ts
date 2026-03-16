import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScheduleTemplate, ScheduleTemplateDocument } from './schemas/schedule-template.schema';
import { StudentSchedule, StudentScheduleDocument } from './schemas/student-schedule.schema';
import { ScheduleEvent, ScheduleEventDocument } from './schemas/schedule-event.schema';
import {
  CreateScheduleTemplateDto,
  UpdateScheduleTemplateDto,
  AssignScheduleDto,
  UpdateStudentScheduleDto,
  CreateScheduleEventDto,
  UpdateScheduleEventDto,
} from './dto/schedule.dto';
import { Plan, PlanDocument } from '../plans/schemas/plan.schema';
import { Subscription, SubscriptionDocument } from '../plans/schemas/subscription.schema';
import { Session, SessionDocument } from '../sessions/schemas/session.schema';
import { StudyCronogram, StudyCronogramDocument } from '../admin/schemas/study-cronogram.schema';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';
import { UserTrackProgress, UserTrackProgressDocument } from '../tracks/schemas/user-track-progress.schema';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(ScheduleTemplate.name) private templateModel: Model<ScheduleTemplateDocument>,
    @InjectModel(StudentSchedule.name) private scheduleModel: Model<StudentScheduleDocument>,
    @InjectModel(ScheduleEvent.name) private eventModel: Model<ScheduleEventDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(StudyCronogram.name) private cronogramModel: Model<StudyCronogramDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(UserTrackProgress.name) private progressModel: Model<UserTrackProgressDocument>,
  ) { }

  // ─── TEMPLATES (Admin/Mentor) ───

  async createTemplate(dto: CreateScheduleTemplateDto): Promise<ScheduleTemplateDocument> {
    // If marking as default, unset current default for that plan
    if (dto.isDefault) {
      await this.templateModel.updateMany(
        { planSlug: dto.planSlug, isDefault: true },
        { $set: { isDefault: false } },
      );
    }
    return this.templateModel.create(dto);
  }

  async listTemplates(planSlug?: string): Promise<any[]> {
    const query: any = { isActive: true };
    if (planSlug) query.planSlug = planSlug;
    return this.templateModel.find(query).sort({ planSlug: 1, isDefault: -1 }).lean().exec();
  }

  async getTemplate(id: string): Promise<any> {
    const tpl = await this.templateModel.findById(id).lean().exec();
    if (!tpl) throw new NotFoundException('Template não encontrado');
    return tpl;
  }

  async updateTemplate(id: string, dto: UpdateScheduleTemplateDto): Promise<ScheduleTemplateDocument> {
    if (dto.isDefault) {
      const existing = await this.templateModel.findById(id).lean();
      if (existing) {
        await this.templateModel.updateMany(
          { planSlug: dto.planSlug || existing.planSlug, isDefault: true, _id: { $ne: id } },
          { $set: { isDefault: false } },
        );
      }
    }
    const tpl = await this.templateModel.findByIdAndUpdate(id, { $set: dto }, { new: true }).exec();
    if (!tpl) throw new NotFoundException('Template não encontrado');
    return tpl;
  }

  async deleteTemplate(id: string): Promise<void> {
    const tpl = await this.templateModel.findByIdAndDelete(id).exec();
    if (!tpl) throw new NotFoundException('Template não encontrado');
  }

  // ─── STUDENT SCHEDULE (Mentor assigns) ───

  async assignSchedule(mentorId: string, dto: AssignScheduleDto): Promise<StudentScheduleDocument> {
    // Deactivate current active schedule for this student
    await this.scheduleModel.updateMany(
      { userId: new Types.ObjectId(dto.userId), isActive: true },
      { $set: { isActive: false } },
    );

    if (dto.templateId) {
      // Assign from template
      const template = await this.templateModel.findById(dto.templateId).lean();
      if (!template) throw new NotFoundException('Template não encontrado');

      return this.scheduleModel.create({
        userId: new Types.ObjectId(dto.userId),
        mentorId: new Types.ObjectId(mentorId),
        templateId: new Types.ObjectId(dto.templateId),
        name: dto.name || template.name,
        description: dto.description || template.description,
        isCustom: false,
        items: template.items,
        isActive: true,
      });
    } else {
      // Custom schedule
      if (!dto.items?.length) {
        throw new BadRequestException('Forneça items ou um templateId');
      }
      return this.scheduleModel.create({
        userId: new Types.ObjectId(dto.userId),
        mentorId: new Types.ObjectId(mentorId),
        name: dto.name || 'Cronograma Personalizado',
        description: dto.description || '',
        isCustom: true,
        items: dto.items,
        isActive: true,
      });
    }
  }

  async getStudentSchedule(userId: string): Promise<any> {
    const schedule = await this.scheduleModel
      .findOne({ userId: new Types.ObjectId(userId), isActive: true })
      .populate('mentorId', 'name avatar')
      .lean()
      .exec();
    return schedule;
  }

  async getStudentScheduleHistory(userId: string): Promise<any[]> {
    return this.scheduleModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate('mentorId', 'name avatar')
      .lean()
      .exec();
  }

  async updateStudentSchedule(
    scheduleId: string,
    mentorId: string,
    dto: UpdateStudentScheduleDto,
  ): Promise<StudentScheduleDocument> {
    const schedule = await this.scheduleModel.findOneAndUpdate(
      { _id: scheduleId, mentorId: new Types.ObjectId(mentorId) },
      { $set: { ...dto, isCustom: true } },
      { new: true },
    ).exec();
    if (!schedule) throw new NotFoundException('Cronograma não encontrado');
    return schedule;
  }

  // ─── SCHEDULE EVENTS (one-off activities from mentor) ───

  async createEvent(mentorId: string, dto: CreateScheduleEventDto): Promise<ScheduleEventDocument> {
    return this.eventModel.create({
      ...dto,
      userId: new Types.ObjectId(dto.userId),
      mentorId: new Types.ObjectId(mentorId),
      scheduledDate: new Date(dto.scheduledDate),
    });
  }

  async getStudentEvents(userId: string, startDate?: string, endDate?: string): Promise<any[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }
    return this.eventModel
      .find(query)
      .sort({ scheduledDate: 1, startTime: 1 })
      .populate('mentorId', 'name avatar')
      .lean()
      .exec();
  }

  async getMentorEvents(mentorId: string, startDate?: string, endDate?: string): Promise<any[]> {
    const query: any = { mentorId: new Types.ObjectId(mentorId) };
    if (startDate || endDate) {
      query.scheduledDate = {};
      if (startDate) query.scheduledDate.$gte = new Date(startDate);
      if (endDate) query.scheduledDate.$lte = new Date(endDate);
    }
    return this.eventModel
      .find(query)
      .sort({ scheduledDate: 1, startTime: 1 })
      .populate('userId', 'name avatar email')
      .lean()
      .exec();
  }

  async updateEvent(eventId: string, mentorId: string, dto: UpdateScheduleEventDto): Promise<ScheduleEventDocument> {
    const update: any = { ...dto };
    if (dto.scheduledDate) update.scheduledDate = new Date(dto.scheduledDate);
    const event = await this.eventModel.findOneAndUpdate(
      { _id: eventId, mentorId: new Types.ObjectId(mentorId) },
      { $set: update },
      { new: true },
    ).exec();
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async completeEvent(eventId: string, userId: string): Promise<ScheduleEventDocument> {
    const event = await this.eventModel.findOneAndUpdate(
      { _id: eventId, userId: new Types.ObjectId(userId), status: 'pending' },
      { $set: { status: 'completed' } },
      { new: true },
    ).exec();
    if (!event) throw new NotFoundException('Evento não encontrado');
    return event;
  }

  async deleteEvent(eventId: string, mentorId: string): Promise<void> {
    const event = await this.eventModel.findOneAndDelete({
      _id: eventId,
      mentorId: new Types.ObjectId(mentorId),
    }).exec();
    if (!event) throw new NotFoundException('Evento não encontrado');
  }

  // ─── BOOKING LIMITS ───

  async getBookingInfo(userId: string): Promise<{
    plan: any;
    sessionsPerWeek: number;
    sessionsThisWeek: number;
    canBook: boolean;
  }> {
    // Find user's active subscription
    const subscription = await this.subscriptionModel
      .findOne({ userId: new Types.ObjectId(userId), status: 'active' })
      .populate('planId')
      .lean()
      .exec();

    if (!subscription) {
      return { plan: null, sessionsPerWeek: 0, sessionsThisWeek: 0, canBook: false };
    }

    const plan = subscription.planId as any;
    const sessionsPerWeek = plan?.sessionsPerWeek || 0;

    // Count sessions this week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const sessionsThisWeek = await this.sessionModel.countDocuments({
      userId: new Types.ObjectId(userId),
      scheduledAt: { $gte: startOfWeek, $lt: endOfWeek },
      status: { $in: ['scheduled', 'in_progress', 'completed'] },
    });

    return {
      plan: { name: plan?.name, slug: plan?.slug },
      sessionsPerWeek,
      sessionsThisWeek,
      canBook: sessionsThisWeek < sessionsPerWeek,
    };
  }

  // ─── MENTOR: list students' schedules ───
  async getMentorStudentSchedules(mentorId: string): Promise<any[]> {
    return this.scheduleModel
      .find({ mentorId: new Types.ObjectId(mentorId), isActive: true })
      .populate('userId', 'name avatar email plan')
      .lean()
      .exec();
  }

  // ─── STUDY CRONOGRAM (student-facing) ───

  async moveDailyPlanItem(userId: string, itemId: string, newDate: string): Promise<any> {
    const cronogram = await this.cronogramModel.findOne({
      userId: new Types.ObjectId(userId),
      status: { $in: ['active', 'draft', 'paused'] },
      'dailyPlan._id': new Types.ObjectId(itemId),
    });
    if (!cronogram) throw new NotFoundException('Cronograma ou item não encontrado');

    const item = cronogram.dailyPlan.find(i => (i as any)._id.toString() === itemId);
    if (!item) throw new NotFoundException('Item não encontrado no plano diário');

    (item as any).date = new Date(newDate);
    await cronogram.save();
    return { success: true };
  }

  async getMyStudyCronogram(userId: string, weekStart?: string, weekEnd?: string): Promise<any> {
    const cronogram = await this.cronogramModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: { $in: ['active', 'draft', 'paused'] },
      })
      .populate('createdBy', 'name avatar')
      .lean();

    if (!cronogram) return null;

    // Enrich tracks with Track details & real-time progress
    const trackIds = cronogram.tracks.map(t => t.trackId);
    const [tracks, progresses] = await Promise.all([
      this.trackModel.find({ _id: { $in: trackIds } }).lean(),
      this.progressModel.find({
        userId: new Types.ObjectId(userId),
        trackId: { $in: trackIds },
      }).lean(),
    ]);

    const trackMap = new Map(tracks.map(t => [(t as any)._id.toString(), t]));
    const progressMap = new Map(progresses.map(p => [p.trackId.toString(), p]));

    const now = new Date();
    let completedTracks = 0;
    let overdueTracks = 0;
    let inProgressTracks = 0;

    const enrichedTracks = cronogram.tracks.map(ct => {
      const track = trackMap.get(ct.trackId.toString());
      const progress = progressMap.get(ct.trackId.toString());

      const currentStatus = progress?.status === 'completed'
        ? 'completed'
        : (ct.endDate < now && (progress?.progressPercent || 0) < 100)
          ? 'overdue'
          : progress?.status === 'in_progress' ? 'in_progress' : ct.status;

      if (currentStatus === 'completed') completedTracks++;
      else if (currentStatus === 'overdue') overdueTracks++;
      else if (currentStatus === 'in_progress') inProgressTracks++;

      return {
        ...ct,
        status: currentStatus,
        progressPercent: progress?.progressPercent ?? ct.progressPercent,
        completedLessons: progress?.completedLessons ?? ct.completedLessons,
        totalLessons: track?.totalLessons || track?.lessons?.length || ct.totalLessons,
        track: track ? {
          _id: (track as any)._id,
          title: track.title,
          description: track.description,
          icon: track.icon,
          color: track.color,
          difficulty: track.difficulty,
          estimatedHours: track.estimatedHours,
          totalLessons: track.totalLessons || track.lessons?.length || 0,
        } : null,
      };
    });

    const overallProgress = enrichedTracks.length
      ? Math.round(enrichedTracks.reduce((s, t) => s + (t.progressPercent || 0), 0) / enrichedTracks.length)
      : 0;

    // ── Build today's study plan from dailyPlan ──
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    // Sync dailyPlan completion status with real lesson progress
    const dailyPlan = (cronogram.dailyPlan || []).map(item => {
      const progress = progressMap.get(item.trackId?.toString());
      const lessonDone = progress?.lessonProgress?.some(
        lp => lp.lessonId?.toString() === item.lessonId?.toString() && lp.completed,
      );
      return { ...item, completed: item.completed || !!lessonDone };
    });

    const todayPlan = dailyPlan
      .filter(item => {
        const d = new Date(item.date);
        return d >= todayStart && d <= todayEnd;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => {
        const track = trackMap.get(item.trackId?.toString());
        return {
          ...item,
          track: track ? {
            _id: (track as any)._id,
            title: track.title,
            icon: track.icon,
            color: track.color,
          } : null,
        };
      });

    // Week plan — use provided range or default to current week
    let wkStart: Date;
    let wkEnd: Date;
    if (weekStart && weekEnd) {
      wkStart = new Date(weekStart);
      wkStart.setHours(0, 0, 0, 0);
      wkEnd = new Date(weekEnd);
      wkEnd.setHours(23, 59, 59, 999);
    } else {
      wkStart = new Date(todayStart);
      wkStart.setDate(wkStart.getDate() - wkStart.getDay());
      wkEnd = new Date(wkStart);
      wkEnd.setDate(wkEnd.getDate() + 6);
      wkEnd.setHours(23, 59, 59, 999);
    }

    const weekPlan = dailyPlan
      .filter(item => {
        const d = new Date(item.date);
        return d >= wkStart && d <= wkEnd;
      })
      .sort((a, b) => {
        const da = new Date(a.date).getTime() - new Date(b.date).getTime();
        return da !== 0 ? da : (a.order || 0) - (b.order || 0);
      })
      .map(item => {
        const track = trackMap.get(item.trackId?.toString());
        return {
          ...item,
          track: track ? {
            _id: (track as any)._id,
            title: track.title,
            icon: track.icon,
            color: track.color,
          } : null,
        };
      });

    return {
      ...cronogram,
      tracks: enrichedTracks,
      dailyPlan: undefined, // Don't send the full array
      todayPlan,
      weekPlan,
      overallProgress,
      completedTracks,
      totalTracks: enrichedTracks.length,
      overdueTracks,
      inProgressTracks,
    };
  }
}
