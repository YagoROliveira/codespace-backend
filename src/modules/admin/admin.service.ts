import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';
import { UserTrackProgress, UserTrackProgressDocument } from '../tracks/schemas/user-track-progress.schema';
import { Session as SessionModel, SessionDocument } from '../sessions/schemas/session.schema';
import { Subscription, SubscriptionDocument } from '../plans/schemas/subscription.schema';
import { Plan, PlanDocument } from '../plans/schemas/plan.schema';
import { CodeEvaluation, CodeEvaluationDocument } from './schemas/code-evaluation.schema';
import { PaymentTransaction, PaymentTransactionDocument } from './schemas/payment-transaction.schema';
import { GoogleCalendarService } from '../google-calendar/google-calendar.service';
import { NotificationsService } from '../notifications/notifications.service';
import { InAppNotificationService } from '../notifications/in-app-notification.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(UserTrackProgress.name) private progressModel: Model<UserTrackProgressDocument>,
    @InjectModel(SessionModel.name) private sessionModel: Model<SessionDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(CodeEvaluation.name) private codeEvaluationModel: Model<CodeEvaluationDocument>,
    @InjectModel(PaymentTransaction.name) private paymentTransactionModel: Model<PaymentTransactionDocument>,
    @InjectConnection() private connection: Connection,
    private googleCalendarService: GoogleCalendarService,
    private notificationsService: NotificationsService,
    private inAppNotificationService: InAppNotificationService,
  ) { }

  // ===================== DASHBOARD =====================
  async getDashboardStats() {
    const [
      totalStudents,
      activeStudents,
      totalTracks,
      totalSessions,
      upcomingSessions,
      activeSubscriptions,
      recentStudents,
    ] = await Promise.all([
      this.userModel.countDocuments({ role: { $ne: 'admin' } }),
      this.userModel.countDocuments({ role: { $ne: 'admin' }, status: 'active' }),
      this.trackModel.countDocuments(),
      this.sessionModel.countDocuments(),
      this.sessionModel.countDocuments({ status: 'scheduled', scheduledAt: { $gte: new Date() } }),
      this.subscriptionModel.countDocuments({ status: 'active' }),
      this.userModel.find({ role: { $ne: 'admin' } })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email plan status createdAt role')
        .lean(),
    ]);

    // Revenue calculation via aggregation
    const revenueAgg = await this.subscriptionModel.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);
    const monthlyRevenue = revenueAgg[0]?.total || 0;

    // Sessions this week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const sessionsThisWeek = await this.sessionModel.countDocuments({
      scheduledAt: { $gte: startOfWeek, $lt: endOfWeek },
    });

    // Student distribution by plan
    const planDistribution = await this.userModel.aggregate([
      { $match: { role: { $ne: 'admin' } } },
      { $group: { _id: '$plan', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return {
      totalStudents,
      activeStudents,
      totalTracks,
      totalSessions,
      upcomingSessions,
      sessionsThisWeek,
      activeSubscriptions,
      monthlyRevenue,
      planDistribution,
      recentStudents,
    };
  }

  // ===================== SYSTEM USERS =====================
  async getSystemUsers(filters?: { search?: string; role?: string; status?: string }): Promise<any> {
    const query: any = { role: { $ne: 'user' } };

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters?.role) query.role = filters.role;
    if (filters?.status) query.status = filters.status;

    return this.userModel.find(query)
      .select('-password')
      .sort({ role: 1, createdAt: -1 })
      .lean();
  }

  async createSystemUser(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
    bio?: string;
  }) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) throw new BadRequestException('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userModel.create({
      ...data,
      password: hashedPassword,
      status: 'active',
      plan: data.role === 'user' ? 'free' : 'elite',
      streakDays: 0,
      totalHours: 0,
    });

    const { password, ...result } = user.toObject();
    return result;
  }

  async updateSystemUser(userId: string, data: Partial<{
    name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    bio: string;
    plan: string;
  }>) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { ...data, updatedAt: new Date() },
      { new: true },
    ).select('-password');
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async deleteSystemUser(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.userModel.findByIdAndDelete(userId);
    return { message: 'Usuário excluído com sucesso' };
  }

  async assignMentor(studentId: string, mentorId: string | null) {
    if (mentorId) {
      const mentor = await this.userModel.findById(mentorId);
      if (!mentor || (mentor.role !== 'admin' && mentor.role !== 'mentor')) {
        throw new BadRequestException('Mentor inválido');
      }
    }
    const student = await this.userModel.findByIdAndUpdate(
      studentId,
      { mentorId: mentorId || null },
      { new: true },
    ).select('-password');
    if (!student) throw new NotFoundException('Aluno não encontrado');
    return student;
  }

  // ===================== STUDENTS =====================
  async getStudents(filters?: { search?: string; plan?: string; status?: string }): Promise<any> {
    const query: any = { role: { $ne: 'admin' } };

    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }
    if (filters?.plan) query.plan = filters.plan;
    if (filters?.status) query.status = filters.status;

    const students = await this.userModel.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    if (students.length === 0) return [];

    // Batch-load progress and subscriptions (eliminates N+1)
    const studentIds = students.map(s => s._id);

    const [progressDocs, subscriptionDocs] = await Promise.all([
      this.progressModel.find({ userId: { $in: studentIds } }).lean(),
      this.subscriptionModel.find({ userId: { $in: studentIds }, status: 'active' })
        .populate('planId').lean(),
    ]);

    // Build lookup maps
    const progressByUser = new Map<string, typeof progressDocs>();
    for (const p of progressDocs) {
      const key = p.userId.toString();
      if (!progressByUser.has(key)) progressByUser.set(key, []);
      progressByUser.get(key)!.push(p);
    }

    const subByUser = new Map<string, (typeof subscriptionDocs)[0]>();
    for (const s of subscriptionDocs) {
      subByUser.set(s.userId.toString(), s);
    }

    return students.map(student => {
      const progress = progressByUser.get(student._id.toString()) || [];
      return {
        ...student,
        tracksEnrolled: progress.length,
        tracksCompleted: progress.filter(p => p.status === 'completed').length,
        subscription: subByUser.get(student._id.toString()) || null,
      };
    });
  }

  async getStudentDetail(studentId: string): Promise<any> {
    const student = await this.userModel.findById(studentId)
      .select('-password')
      .populate('mentorId', 'name email avatar')
      .lean();
    if (!student) throw new NotFoundException('Aluno não encontrado');

    const [progress, sessions, subscription] = await Promise.all([
      this.progressModel.find({ userId: student._id }).populate('trackId').lean(),
      this.sessionModel.find({ userId: student._id })
        .populate('mentorId', 'name email avatar')
        .sort({ scheduledAt: -1 }).lean(),
      this.subscriptionModel.findOne({ userId: student._id, status: 'active' }).populate('planId').lean(),
    ]);

    return {
      ...student,
      progress,
      sessions,
      subscription,
    };
  }

  async createStudent(data: {
    name: string;
    email: string;
    password: string;
    plan?: string;
    phone?: string;
    bio?: string;
  }) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) throw new BadRequestException('Email já cadastrado');

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const student = await this.userModel.create({
      ...data,
      password: hashedPassword,
      role: 'user',
      status: 'active',
      plan: data.plan || 'free',
      streakDays: 0,
      totalHours: 0,
    });

    const { password, ...result } = student.toObject();
    return result;
  }

  async updateStudent(studentId: string, data: Partial<{
    name: string;
    email: string;
    plan: string;
    status: string;
    phone: string;
    bio: string;
    github: string;
    linkedin: string;
  }>) {
    const student = await this.userModel.findByIdAndUpdate(
      studentId,
      { ...data, updatedAt: new Date() },
      { new: true },
    ).select('-password');

    if (!student) throw new NotFoundException('Aluno não encontrado');
    return student;
  }

  async grantAccess(
    studentId: string,
    adminId: string,
    data: {
      plan: string;
      duration: number | null; // days, null = unlimited
      reason?: string;
      createSubscription?: boolean;
    },
  ) {
    const student = await this.userModel.findById(studentId);
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // Calculate subscription end date
    const now = new Date();
    let subscriptionEndDate: Date | null = null;
    if (data.duration && data.duration > 0) {
      subscriptionEndDate = new Date(now);
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() + data.duration);
    }

    // Update user fields
    const updateFields: Record<string, any> = {
      plan: data.plan,
      accountStatus: 'active',
      status: 'active',
      updatedAt: now,
    };
    if (subscriptionEndDate) {
      updateFields.subscriptionEndDate = subscriptionEndDate;
    } else {
      // Unlimited — clear end date
      updateFields.subscriptionEndDate = null;
    }

    // Add admin note about the grant
    const noteContent = data.reason
      ? `[Liberação de Acesso] Plano: ${data.plan}, Duração: ${data.duration ? data.duration + ' dias' : 'ilimitado'}. Motivo: ${data.reason}`
      : `[Liberação de Acesso] Plano: ${data.plan}, Duração: ${data.duration ? data.duration + ' dias' : 'ilimitado'}`;

    const updatedStudent = await this.userModel.findByIdAndUpdate(
      studentId,
      {
        ...updateFields,
        $push: {
          adminNotes: {
            _id: new Types.ObjectId(),
            authorId: new Types.ObjectId(adminId),
            content: noteContent,
            createdAt: now,
          },
        },
      },
      { new: true },
    ).select('-password');

    // Optionally create a subscription record
    if (data.createSubscription !== false) {
      // Find the plan by slug
      const planDoc = await this.planModel.findOne({ slug: data.plan });
      if (planDoc) {
        // Cancel any existing active subscription
        await this.subscriptionModel.updateMany(
          { userId: new Types.ObjectId(studentId), status: 'active' },
          { status: 'cancelled', cancelledAt: now },
        );

        await this.subscriptionModel.create({
          userId: new Types.ObjectId(studentId),
          planId: planDoc._id,
          status: 'active',
          startDate: now,
          endDate: subscriptionEndDate || undefined,
          billingCycle: 'monthly',
          amountPaid: 0,
          paymentMethod: 'admin_grant',
        });
      }
    }

    // Send email + in-app notification
    const planLabel = data.plan.charAt(0).toUpperCase() + data.plan.slice(1);
    const durationLabel = data.duration ? `${data.duration} dias` : 'ilimitado';

    try {
      await Promise.all([
        this.notificationsService.sendEmail({
          to: student.email,
          subject: `🎉 Seu acesso ao CodeSPACE foi liberado!`,
          html: this.buildAccessGrantedHtml(student.name, planLabel, durationLabel),
        }),
        this.inAppNotificationService.create({
          userId: student._id.toString(),
          title: 'Acesso Liberado!',
          message: `Seu acesso ao plano ${planLabel} foi ativado. Aproveite todos os recursos!`,
          type: 'access_granted',
          link: '/platform/dashboard',
        }),
      ]);
    } catch (err) {
      console.error('Erro ao enviar notificação de acesso:', err);
    }

    return updatedStudent;
  }

  async revokeAccess(studentId: string, adminId: string, reason?: string) {
    const student = await this.userModel.findById(studentId);
    if (!student) throw new NotFoundException('Aluno não encontrado');

    const now = new Date();
    const noteContent = reason
      ? `[Revogação de Acesso] Motivo: ${reason}`
      : `[Revogação de Acesso] Acesso revogado pelo administrador`;

    // Cancel active subscriptions
    await this.subscriptionModel.updateMany(
      { userId: new Types.ObjectId(studentId), status: 'active' },
      { status: 'cancelled', cancelledAt: now },
    );

    const updatedStudent = await this.userModel.findByIdAndUpdate(
      studentId,
      {
        plan: 'free',
        accountStatus: 'inactive',
        subscriptionEndDate: null,
        updatedAt: now,
        $push: {
          adminNotes: {
            _id: new Types.ObjectId(),
            authorId: new Types.ObjectId(adminId),
            content: noteContent,
            createdAt: now,
          },
        },
      },
      { new: true },
    ).select('-password');

    // Send email + in-app notification
    try {
      await Promise.all([
        this.notificationsService.sendEmail({
          to: student.email,
          subject: 'Atualização sobre seu acesso ao CodeSPACE',
          html: this.buildAccessRevokedHtml(student.name, reason),
        }),
        this.inAppNotificationService.create({
          userId: student._id.toString(),
          title: 'Acesso Atualizado',
          message: 'Seu plano foi alterado. Entre em contato com o suporte para mais informações.',
          type: 'access_revoked',
          link: '/platform/settings',
        }),
      ]);
    } catch (err) {
      console.error('Erro ao enviar notificação de revogação:', err);
    }

    return updatedStudent;
  }

  async deleteStudent(studentId: string) {
    const student = await this.userModel.findById(studentId);
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // Clean up related data
    await Promise.all([
      this.progressModel.deleteMany({ userId: studentId }),
      this.sessionModel.deleteMany({ userId: studentId }),
      this.subscriptionModel.deleteMany({ userId: studentId }),
      this.userModel.findByIdAndDelete(studentId),
    ]);

    return { message: 'Aluno removido com sucesso' };
  }

  // ===================== STUDENT TRACKS (ENROLL / UNENROLL) =====================
  async enrollStudentInTrack(studentId: string, trackId: string): Promise<any> {
    const student = await this.userModel.findById(studentId);
    if (!student) throw new NotFoundException('Aluno não encontrado');

    const track = await this.trackModel.findById(trackId);
    if (!track) throw new NotFoundException('Trilha não encontrada');

    const existing = await this.progressModel.findOne({
      userId: new Types.ObjectId(studentId),
      trackId: new Types.ObjectId(trackId),
    });
    if (existing) throw new BadRequestException('Aluno já está matriculado nesta trilha');

    const progress = await this.progressModel.create({
      userId: new Types.ObjectId(studentId),
      trackId: new Types.ObjectId(trackId),
      status: 'not_started',
      progressPercent: 0,
      completedLessons: 0,
      lessonProgress: [],
      startedAt: new Date(),
    });

    return progress;
  }

  async unenrollStudentFromTrack(studentId: string, trackId: string): Promise<any> {
    const result = await this.progressModel.findOneAndDelete({
      userId: new Types.ObjectId(studentId),
      trackId: new Types.ObjectId(trackId),
    });

    if (!result) throw new NotFoundException('Matrícula não encontrada');
    return { message: 'Aluno removido da trilha com sucesso' };
  }

  // ===================== STUDENT NOTES =====================
  async addStudentNote(studentId: string, adminId: string, content: string): Promise<any> {
    const student = await this.userModel.findById(studentId);
    if (!student) throw new NotFoundException('Aluno não encontrado');

    // We store notes in an array on the student. If adminNotes doesn't exist, we push to it.
    const note = {
      _id: new Types.ObjectId(),
      authorId: new Types.ObjectId(adminId),
      content,
      createdAt: new Date(),
    };

    await this.userModel.findByIdAndUpdate(studentId, {
      $push: { adminNotes: note },
    });

    return note;
  }

  async deleteStudentNote(studentId: string, noteId: string): Promise<any> {
    await this.userModel.findByIdAndUpdate(studentId, {
      $pull: { adminNotes: { _id: new Types.ObjectId(noteId) } },
    });
    return { message: 'Nota removida com sucesso' };
  }

  // ===================== SESSIONS =====================
  async getAllSessions(filters?: { status?: string; type?: string; studentId?: string; mentorId?: string }) {
    const query: any = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.type) query.type = filters.type;
    if (filters?.studentId) query.userId = new Types.ObjectId(filters.studentId);
    if (filters?.mentorId) query.mentorId = new Types.ObjectId(filters.mentorId);

    return this.sessionModel.find(query)
      .populate('userId', 'name email avatar plan')
      .populate('mentorId', 'name email avatar')
      .sort({ scheduledAt: -1 })
      .lean();
  }

  async getSessionDetail(sessionId: string): Promise<any> {
    const session = await this.sessionModel.findById(sessionId)
      .populate('userId', 'name email avatar plan phone')
      .populate('mentorId', 'name email avatar')
      .lean();

    if (!session) throw new NotFoundException('Sessão não encontrada');
    return session;
  }

  async getMentors(): Promise<any> {
    return this.userModel.find({ role: 'admin' })
      .select('name email avatar')
      .sort({ name: 1 })
      .lean();
  }

  async createSession(adminId: string, data: {
    userId: string;
    title: string;
    description?: string;
    scheduledAt: string;
    durationMinutes?: number;
    type?: string;
    meetingUrl?: string;
    topics?: string[];
    generateMeet?: boolean;
  }) {
    const duration = data.durationMinutes || 60;
    let meetingUrl = data.meetingUrl || '';
    let calendarEventId = '';

    // If generateMeet is true, create Google Calendar event with Meet
    if (data.generateMeet && this.googleCalendarService.isConfigured()) {
      // Get student + mentor info for attendees
      const [student, mentor] = await Promise.all([
        this.userModel.findById(data.userId).select('name email').lean(),
        this.userModel.findById(adminId).select('name email').lean(),
      ]);

      const attendees: { email: string; displayName?: string }[] = [];
      if (student?.email) attendees.push({ email: student.email, displayName: student.name });
      if (mentor?.email) attendees.push({ email: mentor.email, displayName: mentor.name });

      const result = await this.googleCalendarService.createEvent({
        summary: data.title,
        description: data.description || `Sessão de ${data.type || 'mentoring'} - Codespace`,
        startDateTime: data.scheduledAt,
        durationMinutes: duration,
        attendees,
      });

      if (result) {
        meetingUrl = result.meetingUrl;
        calendarEventId = result.eventId;
      }
    }

    return this.sessionModel.create({
      ...data,
      mentorId: new Types.ObjectId(adminId),
      userId: new Types.ObjectId(data.userId),
      durationMinutes: duration,
      status: 'scheduled',
      type: data.type || 'mentoring',
      scheduledAt: new Date(data.scheduledAt),
      meetingUrl,
      calendarEventId,
    });
  }

  async updateSession(sessionId: string, data: Partial<{
    title: string;
    description: string;
    scheduledAt: string;
    durationMinutes: number;
    status: string;
    type: string;
    meetingUrl: string;
    recordingUrl: string;
    notes: string;
    topics: string[];
  }>) {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.scheduledAt) updateData.scheduledAt = new Date(data.scheduledAt);

    const session = await this.sessionModel.findByIdAndUpdate(
      sessionId,
      updateData,
      { new: true },
    ).populate('userId', 'name email avatar plan');

    if (!session) throw new NotFoundException('Sessão não encontrada');

    // Sync with Google Calendar if event exists
    if (session.calendarEventId && this.googleCalendarService.isConfigured()) {
      const calendarUpdate: any = {};
      if (data.title) calendarUpdate.summary = data.title;
      if (data.description !== undefined) calendarUpdate.description = data.description;
      if (data.scheduledAt) {
        calendarUpdate.startDateTime = data.scheduledAt;
        calendarUpdate.durationMinutes = data.durationMinutes || session.durationMinutes;
      }

      // If cancelled, delete the calendar event
      if (data.status === 'cancelled') {
        await this.googleCalendarService.deleteEvent(session.calendarEventId);
      } else if (Object.keys(calendarUpdate).length > 0) {
        await this.googleCalendarService.updateEvent(session.calendarEventId, calendarUpdate);
      }
    }

    return session;
  }

  async deleteSession(sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Sessão não encontrada');

    // Delete Google Calendar event if exists
    if (session.calendarEventId && this.googleCalendarService.isConfigured()) {
      await this.googleCalendarService.deleteEvent(session.calendarEventId);
    }

    await this.sessionModel.findByIdAndDelete(sessionId);
    return { message: 'Sessão removida com sucesso' };
  }

  async markSessionNoShow(sessionId: string): Promise<any> {
    const session = await this.sessionModel.findByIdAndUpdate(
      sessionId,
      {
        studentNoShow: true,
        noShowMarkedAt: new Date(),
        status: 'no_show',
        updatedAt: new Date(),
      },
      { new: true },
    ).populate('userId', 'name email avatar plan')
      .populate('mentorId', 'name email avatar');

    if (!session) throw new NotFoundException('Sessão não encontrada');
    return session;
  }

  async addSessionProntuario(sessionId: string, authorId: string, data: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    notes?: string;
  }): Promise<any> {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Sessão não encontrada');

    const entry = {
      _id: new Types.ObjectId(),
      subjective: data.subjective || '',
      objective: data.objective || '',
      assessment: data.assessment || '',
      plan: data.plan || '',
      notes: data.notes || '',
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await this.sessionModel.findByIdAndUpdate(sessionId, {
      $push: { prontuario: entry },
    });

    return entry;
  }

  async updateSessionProntuario(sessionId: string, entryId: string, data: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    notes?: string;
  }): Promise<any> {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) throw new NotFoundException('Sessão não encontrada');

    const updateFields: any = { 'prontuario.$.updatedAt': new Date() };
    if (data.subjective !== undefined) updateFields['prontuario.$.subjective'] = data.subjective;
    if (data.objective !== undefined) updateFields['prontuario.$.objective'] = data.objective;
    if (data.assessment !== undefined) updateFields['prontuario.$.assessment'] = data.assessment;
    if (data.plan !== undefined) updateFields['prontuario.$.plan'] = data.plan;
    if (data.notes !== undefined) updateFields['prontuario.$.notes'] = data.notes;

    await this.sessionModel.findOneAndUpdate(
      { _id: sessionId, 'prontuario._id': new Types.ObjectId(entryId) },
      { $set: updateFields },
    );

    return this.sessionModel.findById(sessionId).lean();
  }

  async deleteSessionProntuario(sessionId: string, entryId: string): Promise<any> {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      $pull: { prontuario: { _id: new Types.ObjectId(entryId) } },
    });
    return { message: 'Prontuário removido com sucesso' };
  }

  async notifyStudent(sessionId: string): Promise<any> {
    const session = await this.sessionModel.findByIdAndUpdate(
      sessionId,
      {
        lastNotifiedAt: new Date(),
        $inc: { notificationCount: 1 },
      },
      { new: true },
    ).populate('userId', 'name email');

    if (!session) throw new NotFoundException('Sessão não encontrada');

    // TODO: Integrate actual email/notification service
    return {
      message: 'Notificação enviada com sucesso',
      notifiedAt: session.lastNotifiedAt,
      student: session.userId,
    };
  }

  // ===================== TRACKS =====================
  async getAllTracks(): Promise<any> {
    const tracks = await this.trackModel.find().sort({ order: 1 }).lean();

    if (tracks.length === 0) return [];

    // Single aggregation instead of 2 queries per track (eliminates N+1)
    const stats = await this.progressModel.aggregate([
      { $match: { trackId: { $in: tracks.map(t => t._id) } } },
      {
        $group: {
          _id: '$trackId',
          enrollments: { $sum: 1 },
          completions: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        },
      },
    ]);

    const statsMap = new Map(stats.map(s => [s._id.toString(), s]));

    return tracks.map(track => {
      const s = statsMap.get(track._id.toString());
      return { ...track, enrollments: s?.enrollments || 0, completions: s?.completions || 0 };
    });
  }

  async createTrack(data: {
    title: string;
    description: string;
    icon?: string;
    color?: string;
    tags?: string[];
    difficulty?: string;
    estimatedHours?: number;
    requiredPlans?: string[];
    isPublished?: boolean;
    order?: number;
    lessons?: Array<{
      title: string;
      description?: string;
      videoUrl?: string;
      content?: string;
      durationMinutes?: number;
      order?: number;
    }>;
  }) {
    const lessons = (data.lessons || []).map((lesson, i) => ({
      _id: new Types.ObjectId(),
      ...lesson,
      order: lesson.order || i + 1,
    }));

    return this.trackModel.create({
      ...data,
      lessons,
      totalLessons: lessons.length,
    });
  }

  async updateTrack(trackId: string, data: Partial<{
    title: string;
    description: string;
    icon: string;
    color: string;
    tags: string[];
    difficulty: string;
    estimatedHours: number;
    requiredPlans: string[];
    isPublished: boolean;
    order: number;
    lessons: Array<{
      _id?: string;
      title: string;
      description?: string;
      videoUrl?: string;
      content?: string;
      durationMinutes?: number;
      order?: number;
    }>;
  }>) {
    const updateData: any = { ...data, updatedAt: new Date() };

    if (data.lessons) {
      updateData.lessons = data.lessons.map((lesson, i) => ({
        _id: lesson._id ? new Types.ObjectId(lesson._id) : new Types.ObjectId(),
        ...lesson,
        order: lesson.order || i + 1,
      }));
      updateData.totalLessons = updateData.lessons.length;
    }

    const track = await this.trackModel.findByIdAndUpdate(
      trackId,
      updateData,
      { new: true },
    );

    if (!track) throw new NotFoundException('Trilha não encontrada');
    return track;
  }

  async deleteTrack(trackId: string) {
    const track = await this.trackModel.findByIdAndDelete(trackId);
    if (!track) throw new NotFoundException('Trilha não encontrada');
    await this.progressModel.deleteMany({ trackId });
    return { message: 'Trilha removida com sucesso' };
  }

  // ===================== SUBSCRIPTIONS =====================
  async getAllSubscriptions(filters?: { status?: string }) {
    const query: any = {};
    if (filters?.status) query.status = filters.status;

    return this.subscriptionModel.find(query)
      .populate('userId', 'name email avatar plan')
      .populate('planId')
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateSubscription(subscriptionId: string, data: Partial<{
    status: string;
    endDate: string;
    billingCycle: string;
  }>) {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.status === 'cancelled') updateData.cancelledAt = new Date();

    const subscription = await this.subscriptionModel.findByIdAndUpdate(
      subscriptionId,
      updateData,
      { new: true },
    ).populate('userId', 'name email plan').populate('planId');

    if (!subscription) throw new NotFoundException('Assinatura não encontrada');
    return subscription;
  }

  // ===================== TRACK DETAIL =====================
  async getTrackDetail(trackId: string): Promise<any> {
    const track = await this.trackModel.findById(trackId).lean();
    if (!track) throw new NotFoundException('Trilha não encontrada');

    const [enrolledStudents, plans] = await Promise.all([
      this.progressModel.find({ trackId: track._id })
        .populate('userId', 'name email avatar plan status')
        .lean(),
      this.planModel.find().lean(),
    ]);

    const completions = enrolledStudents.filter(e => e.status === 'completed').length;
    const avgProgress = enrolledStudents.length > 0
      ? enrolledStudents.reduce((sum, e) => sum + (e.progressPercent || 0), 0) / enrolledStudents.length
      : 0;

    return {
      ...track,
      enrolledStudents: enrolledStudents.map(e => ({
        ...e,
        student: e.userId,
      })),
      enrollments: enrolledStudents.length,
      completions,
      avgProgress,
      availablePlans: plans,
    };
  }

  async addTrackDocument(trackId: string, data: {
    title: string;
    description?: string;
    fileUrl: string;
    fileType?: string;
    fileSizeKb?: number;
  }): Promise<any> {
    const track = await this.trackModel.findById(trackId);
    if (!track) throw new NotFoundException('Trilha não encontrada');

    const doc = {
      _id: new Types.ObjectId(),
      title: data.title,
      description: data.description || '',
      fileUrl: data.fileUrl,
      fileType: data.fileType || '',
      fileSizeKb: data.fileSizeKb || 0,
      uploadedAt: new Date(),
    };

    await this.trackModel.findByIdAndUpdate(trackId, {
      $push: { documents: doc },
    });

    return doc;
  }

  async deleteTrackDocument(trackId: string, documentId: string): Promise<any> {
    await this.trackModel.findByIdAndUpdate(trackId, {
      $pull: { documents: { _id: new Types.ObjectId(documentId) } },
    });
    return { message: 'Documento removido com sucesso' };
  }

  // ===================== CODE EVALUATIONS =====================
  async getStudentEvaluations(studentId: string): Promise<any> {
    return this.codeEvaluationModel.find({ studentId: new Types.ObjectId(studentId) })
      .populate('reviewerId', 'name email')
      .populate('trackId', 'title icon color')
      .sort({ createdAt: -1 })
      .lean();
  }

  async createCodeEvaluation(reviewerId: string, data: {
    studentId: string;
    trackId?: string;
    title: string;
    description?: string;
    language?: string;
    codeSnippet?: string;
    repositoryUrl?: string;
    criteria?: Array<{ name: string; score: number; comment?: string }>;
    overallScore?: number;
    status?: string;
    feedback?: string;
    strengths?: string;
    improvements?: string;
  }): Promise<any> {
    return this.codeEvaluationModel.create({
      ...data,
      studentId: new Types.ObjectId(data.studentId),
      reviewerId: new Types.ObjectId(reviewerId),
      trackId: data.trackId ? new Types.ObjectId(data.trackId) : undefined,
      status: data.status || 'pending',
      evaluatedAt: data.status === 'completed' ? new Date() : undefined,
    });
  }

  async updateCodeEvaluation(evaluationId: string, data: Partial<{
    title: string;
    description: string;
    language: string;
    codeSnippet: string;
    repositoryUrl: string;
    criteria: Array<{ name: string; score: number; comment?: string }>;
    overallScore: number;
    status: string;
    feedback: string;
    strengths: string;
    improvements: string;
  }>): Promise<any> {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.status === 'completed') updateData.evaluatedAt = new Date();

    const evaluation = await this.codeEvaluationModel.findByIdAndUpdate(
      evaluationId,
      updateData,
      { new: true },
    );
    if (!evaluation) throw new NotFoundException('Avaliação não encontrada');
    return evaluation;
  }

  async deleteCodeEvaluation(evaluationId: string): Promise<any> {
    const evaluation = await this.codeEvaluationModel.findByIdAndDelete(evaluationId);
    if (!evaluation) throw new NotFoundException('Avaliação não encontrada');
    return { message: 'Avaliação removida com sucesso' };
  }

  // ===================== PAYMENT TRANSACTIONS =====================
  async getStudentPayments(studentId: string): Promise<any> {
    return this.paymentTransactionModel.find({ userId: new Types.ObjectId(studentId) })
      .populate('planId', 'name price')
      .sort({ createdAt: -1 })
      .lean();
  }

  async createPaymentTransaction(data: {
    userId: string;
    subscriptionId?: string;
    planId?: string;
    amount: number;
    currency?: string;
    status?: string;
    paymentMethod?: string;
    description?: string;
    gatewayTransactionId?: string;
    gatewayProvider?: string;
    invoiceUrl?: string;
  }): Promise<any> {
    return this.paymentTransactionModel.create({
      ...data,
      userId: new Types.ObjectId(data.userId),
      subscriptionId: data.subscriptionId ? new Types.ObjectId(data.subscriptionId) : undefined,
      planId: data.planId ? new Types.ObjectId(data.planId) : undefined,
      status: data.status || 'pending',
      currency: data.currency || 'BRL',
      paymentMethod: data.paymentMethod || 'credit_card',
      paidAt: data.status === 'succeeded' ? new Date() : undefined,
    });
  }

  async getStudentPaymentSummary(studentId: string): Promise<any> {
    const [summaryAgg, payments] = await Promise.all([
      this.paymentTransactionModel.aggregate([
        { $match: { userId: new Types.ObjectId(studentId) } },
        {
          $group: {
            _id: null,
            totalPaid: { $sum: { $cond: [{ $eq: ['$status', 'succeeded'] }, '$amount', 0] } },
            totalRefunded: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'refunded'] },
                  { $ifNull: ['$refundedAmount', '$amount'] },
                  0,
                ],
              },
            },
            failedAttempts: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
            totalTransactions: { $sum: 1 },
          },
        },
      ]),
      this.paymentTransactionModel.find({ userId: new Types.ObjectId(studentId) })
        .sort({ createdAt: -1 }).lean(),
    ]);

    const summary = summaryAgg[0] || { totalPaid: 0, totalRefunded: 0, failedAttempts: 0, totalTransactions: 0 };
    return { ...summary, _id: undefined, payments };
  }

  // ===================== EMAIL HTML BUILDERS =====================
  private buildAccessGrantedHtml(name: string, plan: string, duration: string): string {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:12px;border:1px solid #27272a;">
  <tr><td style="padding:32px 32px 0;">
    <div style="font-size:20px;font-weight:700;color:#f4f4f5;letter-spacing:-0.5px;">code<span style="color:#3b82f6;">SPACE</span></div>
  </td></tr>
  <tr><td style="padding:24px 32px;">
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#f4f4f5;">Acesso Liberado!</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#a1a1aa;line-height:1.6;">
      Olá <strong style="color:#f4f4f5;">${name}</strong>, seu acesso ao CodeSPACE foi ativado com sucesso.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f12;border-radius:8px;border:1px solid #27272a;margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #27272a;">
          <span style="font-size:13px;color:#71717a;">Plano</span><br/>
          <span style="font-size:15px;font-weight:600;color:#3b82f6;">${plan}</span>
        </td>
        <td style="padding:16px 20px;border-bottom:1px solid #27272a;" align="right">
          <span style="font-size:13px;color:#71717a;">Duração</span><br/>
          <span style="font-size:15px;font-weight:600;color:#f4f4f5;">${duration}</span>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.6;">
      Você agora tem acesso a todas as funcionalidades do seu plano. Acesse a plataforma e comece a evoluir!
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;"><tr><td style="background:#3b82f6;border-radius:8px;padding:12px 28px;">
      <a href="${process.env.FRONTEND_URL || 'https://codespace.com.br'}/login" style="color:#fff;font-size:14px;font-weight:600;text-decoration:none;">Acessar Plataforma</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:20px 32px;border-top:1px solid #27272a;">
    <p style="margin:0;font-size:12px;color:#52525b;">© ${new Date().getFullYear()} CodeSPACE. Todos os direitos reservados.</p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
  }

  private buildAccessRevokedHtml(name: string, reason?: string): string {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#18181b;border-radius:12px;border:1px solid #27272a;">
  <tr><td style="padding:32px 32px 0;">
    <div style="font-size:20px;font-weight:700;color:#f4f4f5;letter-spacing:-0.5px;">code<span style="color:#3b82f6;">SPACE</span></div>
  </td></tr>
  <tr><td style="padding:24px 32px;">
    <h1 style="margin:0 0 8px;font-size:22px;font-weight:600;color:#f4f4f5;">Atualização de Acesso</h1>
    <p style="margin:0 0 20px;font-size:15px;color:#a1a1aa;line-height:1.6;">
      Olá <strong style="color:#f4f4f5;">${name}</strong>, houve uma atualização no seu acesso ao CodeSPACE.
    </p>
    ${reason ? `<table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f12;border-radius:8px;border:1px solid #27272a;margin-bottom:20px;">
      <tr><td style="padding:16px 20px;">
        <span style="font-size:13px;color:#71717a;">Motivo</span><br/>
        <span style="font-size:14px;color:#a1a1aa;line-height:1.5;">${reason}</span>
      </td></tr>
    </table>` : ''}
    <p style="margin:0 0 24px;font-size:14px;color:#a1a1aa;line-height:1.6;">
      Se você acredita que houve um erro ou deseja renovar seu acesso, entre em contato com nossa equipe de suporte.
    </p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:8px;"><tr><td style="background:#27272a;border-radius:8px;padding:12px 28px;">
      <a href="mailto:mentoria@codespace.com.br" style="color:#f4f4f5;font-size:14px;font-weight:600;text-decoration:none;">Falar com Suporte</a>
    </td></tr></table>
  </td></tr>
  <tr><td style="padding:20px 32px;border-top:1px solid #27272a;">
    <p style="margin:0;font-size:12px;color:#52525b;">© ${new Date().getFullYear()} CodeSPACE. Todos os direitos reservados.</p>
  </td></tr>
</table>
</td></tr></table></body></html>`;
  }
}
