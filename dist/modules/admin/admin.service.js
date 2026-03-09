"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const track_schema_1 = require("../tracks/schemas/track.schema");
const user_track_progress_schema_1 = require("../tracks/schemas/user-track-progress.schema");
const session_schema_1 = require("../sessions/schemas/session.schema");
const subscription_schema_1 = require("../plans/schemas/subscription.schema");
const plan_schema_1 = require("../plans/schemas/plan.schema");
const code_evaluation_schema_1 = require("./schemas/code-evaluation.schema");
const payment_transaction_schema_1 = require("./schemas/payment-transaction.schema");
const bcrypt = __importStar(require("bcryptjs"));
let AdminService = class AdminService {
    constructor(userModel, trackModel, progressModel, sessionModel, subscriptionModel, planModel, codeEvaluationModel, paymentTransactionModel, connection) {
        this.userModel = userModel;
        this.trackModel = trackModel;
        this.progressModel = progressModel;
        this.sessionModel = sessionModel;
        this.subscriptionModel = subscriptionModel;
        this.planModel = planModel;
        this.codeEvaluationModel = codeEvaluationModel;
        this.paymentTransactionModel = paymentTransactionModel;
        this.connection = connection;
    }
    async getDashboardStats() {
        const [totalStudents, activeStudents, totalTracks, totalSessions, upcomingSessions, activeSubscriptions, recentStudents,] = await Promise.all([
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
        const subscriptions = await this.subscriptionModel.find({ status: 'active' }).lean();
        const monthlyRevenue = subscriptions.reduce((sum, s) => sum + (s.amountPaid || 0), 0);
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        const sessionsThisWeek = await this.sessionModel.countDocuments({
            scheduledAt: { $gte: startOfWeek, $lt: endOfWeek },
        });
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
    async getSystemUsers(filters) {
        const query = { role: { $ne: 'user' } };
        if (filters?.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
            ];
        }
        if (filters?.role)
            query.role = filters.role;
        if (filters?.status)
            query.status = filters.status;
        return this.userModel.find(query)
            .select('-password')
            .sort({ role: 1, createdAt: -1 })
            .lean();
    }
    async createSystemUser(data) {
        const existing = await this.userModel.findOne({ email: data.email });
        if (existing)
            throw new common_1.BadRequestException('Email já cadastrado');
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
    async updateSystemUser(userId, data) {
        const user = await this.userModel.findByIdAndUpdate(userId, { ...data, updatedAt: new Date() }, { new: true }).select('-password');
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user;
    }
    async deleteSystemUser(userId) {
        const user = await this.userModel.findById(userId);
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        await this.userModel.findByIdAndDelete(userId);
        return { message: 'Usuário excluído com sucesso' };
    }
    async assignMentor(studentId, mentorId) {
        if (mentorId) {
            const mentor = await this.userModel.findById(mentorId);
            if (!mentor || (mentor.role !== 'admin' && mentor.role !== 'mentor')) {
                throw new common_1.BadRequestException('Mentor inválido');
            }
        }
        const student = await this.userModel.findByIdAndUpdate(studentId, { mentorId: mentorId || null }, { new: true }).select('-password');
        if (!student)
            throw new common_1.NotFoundException('Aluno não encontrado');
        return student;
    }
    async getStudents(filters) {
        const query = { role: { $ne: 'admin' } };
        if (filters?.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
            ];
        }
        if (filters?.plan)
            query.plan = filters.plan;
        if (filters?.status)
            query.status = filters.status;
        const students = await this.userModel.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();
        const enriched = await Promise.all(students.map(async (student) => {
            const progress = await this.progressModel.find({ userId: student._id }).lean();
            const subscription = await this.subscriptionModel.findOne({
                userId: student._id,
                status: 'active',
            }).populate('planId').lean();
            return {
                ...student,
                tracksEnrolled: progress.length,
                tracksCompleted: progress.filter(p => p.status === 'completed').length,
                subscription: subscription || null,
            };
        }));
        return enriched;
    }
    async getStudentDetail(studentId) {
        const student = await this.userModel.findById(studentId)
            .select('-password')
            .populate('mentorId', 'name email avatar')
            .lean();
        if (!student)
            throw new common_1.NotFoundException('Aluno não encontrado');
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
    async createStudent(data) {
        const existing = await this.userModel.findOne({ email: data.email });
        if (existing)
            throw new common_1.BadRequestException('Email já cadastrado');
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
    async updateStudent(studentId, data) {
        const student = await this.userModel.findByIdAndUpdate(studentId, { ...data, updatedAt: new Date() }, { new: true }).select('-password');
        if (!student)
            throw new common_1.NotFoundException('Aluno não encontrado');
        return student;
    }
    async deleteStudent(studentId) {
        const student = await this.userModel.findById(studentId);
        if (!student)
            throw new common_1.NotFoundException('Aluno não encontrado');
        await Promise.all([
            this.progressModel.deleteMany({ userId: studentId }),
            this.sessionModel.deleteMany({ userId: studentId }),
            this.subscriptionModel.deleteMany({ userId: studentId }),
            this.userModel.findByIdAndDelete(studentId),
        ]);
        return { message: 'Aluno removido com sucesso' };
    }
    async enrollStudentInTrack(studentId, trackId) {
        const student = await this.userModel.findById(studentId);
        if (!student)
            throw new common_1.NotFoundException('Aluno não encontrado');
        const track = await this.trackModel.findById(trackId);
        if (!track)
            throw new common_1.NotFoundException('Trilha não encontrada');
        const existing = await this.progressModel.findOne({
            userId: new mongoose_2.Types.ObjectId(studentId),
            trackId: new mongoose_2.Types.ObjectId(trackId),
        });
        if (existing)
            throw new common_1.BadRequestException('Aluno já está matriculado nesta trilha');
        const progress = await this.progressModel.create({
            userId: new mongoose_2.Types.ObjectId(studentId),
            trackId: new mongoose_2.Types.ObjectId(trackId),
            status: 'not_started',
            progressPercent: 0,
            completedLessons: 0,
            lessonProgress: [],
            startedAt: new Date(),
        });
        return progress;
    }
    async unenrollStudentFromTrack(studentId, trackId) {
        const result = await this.progressModel.findOneAndDelete({
            userId: new mongoose_2.Types.ObjectId(studentId),
            trackId: new mongoose_2.Types.ObjectId(trackId),
        });
        if (!result)
            throw new common_1.NotFoundException('Matrícula não encontrada');
        return { message: 'Aluno removido da trilha com sucesso' };
    }
    async addStudentNote(studentId, adminId, content) {
        const student = await this.userModel.findById(studentId);
        if (!student)
            throw new common_1.NotFoundException('Aluno não encontrado');
        const note = {
            _id: new mongoose_2.Types.ObjectId(),
            authorId: new mongoose_2.Types.ObjectId(adminId),
            content,
            createdAt: new Date(),
        };
        await this.userModel.findByIdAndUpdate(studentId, {
            $push: { adminNotes: note },
        });
        return note;
    }
    async deleteStudentNote(studentId, noteId) {
        await this.userModel.findByIdAndUpdate(studentId, {
            $pull: { adminNotes: { _id: new mongoose_2.Types.ObjectId(noteId) } },
        });
        return { message: 'Nota removida com sucesso' };
    }
    async getAllSessions(filters) {
        const query = {};
        if (filters?.status)
            query.status = filters.status;
        if (filters?.type)
            query.type = filters.type;
        if (filters?.studentId)
            query.userId = new mongoose_2.Types.ObjectId(filters.studentId);
        if (filters?.mentorId)
            query.mentorId = new mongoose_2.Types.ObjectId(filters.mentorId);
        return this.sessionModel.find(query)
            .populate('userId', 'name email avatar plan')
            .populate('mentorId', 'name email avatar')
            .sort({ scheduledAt: -1 })
            .lean();
    }
    async getSessionDetail(sessionId) {
        const session = await this.sessionModel.findById(sessionId)
            .populate('userId', 'name email avatar plan phone')
            .populate('mentorId', 'name email avatar')
            .lean();
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return session;
    }
    async getMentors() {
        return this.userModel.find({ role: 'admin' })
            .select('name email avatar')
            .sort({ name: 1 })
            .lean();
    }
    async createSession(adminId, data) {
        return this.sessionModel.create({
            ...data,
            mentorId: new mongoose_2.Types.ObjectId(adminId),
            userId: new mongoose_2.Types.ObjectId(data.userId),
            durationMinutes: data.durationMinutes || 60,
            status: 'scheduled',
            type: data.type || 'mentoring',
            scheduledAt: new Date(data.scheduledAt),
        });
    }
    async updateSession(sessionId, data) {
        const updateData = { ...data, updatedAt: new Date() };
        if (data.scheduledAt)
            updateData.scheduledAt = new Date(data.scheduledAt);
        const session = await this.sessionModel.findByIdAndUpdate(sessionId, updateData, { new: true }).populate('userId', 'name email avatar plan');
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return session;
    }
    async deleteSession(sessionId) {
        const session = await this.sessionModel.findByIdAndDelete(sessionId);
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return { message: 'Sessão removida com sucesso' };
    }
    async markSessionNoShow(sessionId) {
        const session = await this.sessionModel.findByIdAndUpdate(sessionId, {
            studentNoShow: true,
            noShowMarkedAt: new Date(),
            status: 'no_show',
            updatedAt: new Date(),
        }, { new: true }).populate('userId', 'name email avatar plan')
            .populate('mentorId', 'name email avatar');
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return session;
    }
    async addSessionProntuario(sessionId, authorId, data) {
        const session = await this.sessionModel.findById(sessionId);
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        const entry = {
            _id: new mongoose_2.Types.ObjectId(),
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
    async updateSessionProntuario(sessionId, entryId, data) {
        const session = await this.sessionModel.findById(sessionId);
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        const updateFields = { 'prontuario.$.updatedAt': new Date() };
        if (data.subjective !== undefined)
            updateFields['prontuario.$.subjective'] = data.subjective;
        if (data.objective !== undefined)
            updateFields['prontuario.$.objective'] = data.objective;
        if (data.assessment !== undefined)
            updateFields['prontuario.$.assessment'] = data.assessment;
        if (data.plan !== undefined)
            updateFields['prontuario.$.plan'] = data.plan;
        if (data.notes !== undefined)
            updateFields['prontuario.$.notes'] = data.notes;
        await this.sessionModel.findOneAndUpdate({ _id: sessionId, 'prontuario._id': new mongoose_2.Types.ObjectId(entryId) }, { $set: updateFields });
        return this.sessionModel.findById(sessionId).lean();
    }
    async deleteSessionProntuario(sessionId, entryId) {
        await this.sessionModel.findByIdAndUpdate(sessionId, {
            $pull: { prontuario: { _id: new mongoose_2.Types.ObjectId(entryId) } },
        });
        return { message: 'Prontuário removido com sucesso' };
    }
    async notifyStudent(sessionId) {
        const session = await this.sessionModel.findByIdAndUpdate(sessionId, {
            lastNotifiedAt: new Date(),
            $inc: { notificationCount: 1 },
        }, { new: true }).populate('userId', 'name email');
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return {
            message: 'Notificação enviada com sucesso',
            notifiedAt: session.lastNotifiedAt,
            student: session.userId,
        };
    }
    async getAllTracks() {
        const tracks = await this.trackModel.find().sort({ order: 1 }).lean();
        const enriched = await Promise.all(tracks.map(async (track) => {
            const enrollments = await this.progressModel.countDocuments({ trackId: track._id });
            const completions = await this.progressModel.countDocuments({ trackId: track._id, status: 'completed' });
            return { ...track, enrollments, completions };
        }));
        return enriched;
    }
    async createTrack(data) {
        const lessons = (data.lessons || []).map((lesson, i) => ({
            _id: new mongoose_2.Types.ObjectId(),
            ...lesson,
            order: lesson.order || i + 1,
        }));
        return this.trackModel.create({
            ...data,
            lessons,
            totalLessons: lessons.length,
        });
    }
    async updateTrack(trackId, data) {
        const updateData = { ...data, updatedAt: new Date() };
        if (data.lessons) {
            updateData.lessons = data.lessons.map((lesson, i) => ({
                _id: lesson._id ? new mongoose_2.Types.ObjectId(lesson._id) : new mongoose_2.Types.ObjectId(),
                ...lesson,
                order: lesson.order || i + 1,
            }));
            updateData.totalLessons = updateData.lessons.length;
        }
        const track = await this.trackModel.findByIdAndUpdate(trackId, updateData, { new: true });
        if (!track)
            throw new common_1.NotFoundException('Trilha não encontrada');
        return track;
    }
    async deleteTrack(trackId) {
        const track = await this.trackModel.findByIdAndDelete(trackId);
        if (!track)
            throw new common_1.NotFoundException('Trilha não encontrada');
        await this.progressModel.deleteMany({ trackId });
        return { message: 'Trilha removida com sucesso' };
    }
    async getAllSubscriptions(filters) {
        const query = {};
        if (filters?.status)
            query.status = filters.status;
        return this.subscriptionModel.find(query)
            .populate('userId', 'name email avatar plan')
            .populate('planId')
            .sort({ createdAt: -1 })
            .lean();
    }
    async updateSubscription(subscriptionId, data) {
        const updateData = { ...data, updatedAt: new Date() };
        if (data.endDate)
            updateData.endDate = new Date(data.endDate);
        if (data.status === 'cancelled')
            updateData.cancelledAt = new Date();
        const subscription = await this.subscriptionModel.findByIdAndUpdate(subscriptionId, updateData, { new: true }).populate('userId', 'name email plan').populate('planId');
        if (!subscription)
            throw new common_1.NotFoundException('Assinatura não encontrada');
        return subscription;
    }
    async getTrackDetail(trackId) {
        const track = await this.trackModel.findById(trackId).lean();
        if (!track)
            throw new common_1.NotFoundException('Trilha não encontrada');
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
    async addTrackDocument(trackId, data) {
        const track = await this.trackModel.findById(trackId);
        if (!track)
            throw new common_1.NotFoundException('Trilha não encontrada');
        const doc = {
            _id: new mongoose_2.Types.ObjectId(),
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
    async deleteTrackDocument(trackId, documentId) {
        await this.trackModel.findByIdAndUpdate(trackId, {
            $pull: { documents: { _id: new mongoose_2.Types.ObjectId(documentId) } },
        });
        return { message: 'Documento removido com sucesso' };
    }
    async getStudentEvaluations(studentId) {
        return this.codeEvaluationModel.find({ studentId: new mongoose_2.Types.ObjectId(studentId) })
            .populate('reviewerId', 'name email')
            .populate('trackId', 'title icon color')
            .sort({ createdAt: -1 })
            .lean();
    }
    async createCodeEvaluation(reviewerId, data) {
        return this.codeEvaluationModel.create({
            ...data,
            studentId: new mongoose_2.Types.ObjectId(data.studentId),
            reviewerId: new mongoose_2.Types.ObjectId(reviewerId),
            trackId: data.trackId ? new mongoose_2.Types.ObjectId(data.trackId) : undefined,
            status: data.status || 'pending',
            evaluatedAt: data.status === 'completed' ? new Date() : undefined,
        });
    }
    async updateCodeEvaluation(evaluationId, data) {
        const updateData = { ...data, updatedAt: new Date() };
        if (data.status === 'completed')
            updateData.evaluatedAt = new Date();
        const evaluation = await this.codeEvaluationModel.findByIdAndUpdate(evaluationId, updateData, { new: true });
        if (!evaluation)
            throw new common_1.NotFoundException('Avaliação não encontrada');
        return evaluation;
    }
    async deleteCodeEvaluation(evaluationId) {
        const evaluation = await this.codeEvaluationModel.findByIdAndDelete(evaluationId);
        if (!evaluation)
            throw new common_1.NotFoundException('Avaliação não encontrada');
        return { message: 'Avaliação removida com sucesso' };
    }
    async getStudentPayments(studentId) {
        return this.paymentTransactionModel.find({ userId: new mongoose_2.Types.ObjectId(studentId) })
            .populate('planId', 'name price')
            .sort({ createdAt: -1 })
            .lean();
    }
    async createPaymentTransaction(data) {
        return this.paymentTransactionModel.create({
            ...data,
            userId: new mongoose_2.Types.ObjectId(data.userId),
            subscriptionId: data.subscriptionId ? new mongoose_2.Types.ObjectId(data.subscriptionId) : undefined,
            planId: data.planId ? new mongoose_2.Types.ObjectId(data.planId) : undefined,
            status: data.status || 'pending',
            currency: data.currency || 'BRL',
            paymentMethod: data.paymentMethod || 'credit_card',
            paidAt: data.status === 'succeeded' ? new Date() : undefined,
        });
    }
    async getStudentPaymentSummary(studentId) {
        const payments = await this.paymentTransactionModel.find({
            userId: new mongoose_2.Types.ObjectId(studentId),
        }).lean();
        const totalPaid = payments
            .filter(p => p.status === 'succeeded')
            .reduce((sum, p) => sum + p.amount, 0);
        const totalRefunded = payments
            .filter(p => p.status === 'refunded')
            .reduce((sum, p) => sum + (p.refundedAmount || p.amount), 0);
        const failedAttempts = payments.filter(p => p.status === 'failed').length;
        const totalTransactions = payments.length;
        return { totalPaid, totalRefunded, failedAttempts, totalTransactions, payments };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_track_progress_schema_1.UserTrackProgress.name)),
    __param(3, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(4, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __param(5, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __param(6, (0, mongoose_1.InjectModel)(code_evaluation_schema_1.CodeEvaluation.name)),
    __param(7, (0, mongoose_1.InjectModel)(payment_transaction_schema_1.PaymentTransaction.name)),
    __param(8, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Connection])
], AdminService);
//# sourceMappingURL=admin.service.js.map