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

@Injectable()
export class SchedulesService {
  constructor(
    @InjectModel(ScheduleTemplate.name) private templateModel: Model<ScheduleTemplateDocument>,
    @InjectModel(StudentSchedule.name) private scheduleModel: Model<StudentScheduleDocument>,
    @InjectModel(ScheduleEvent.name) private eventModel: Model<ScheduleEventDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

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
}
