import { Model, Connection, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Track, TrackDocument } from '../tracks/schemas/track.schema';
import { UserTrackProgressDocument } from '../tracks/schemas/user-track-progress.schema';
import { Session as SessionModel, SessionDocument } from '../sessions/schemas/session.schema';
import { Subscription, SubscriptionDocument } from '../plans/schemas/subscription.schema';
import { PlanDocument } from '../plans/schemas/plan.schema';
import { CodeEvaluationDocument } from './schemas/code-evaluation.schema';
import { PaymentTransactionDocument } from './schemas/payment-transaction.schema';
export declare class AdminService {
    private userModel;
    private trackModel;
    private progressModel;
    private sessionModel;
    private subscriptionModel;
    private planModel;
    private codeEvaluationModel;
    private paymentTransactionModel;
    private connection;
    constructor(userModel: Model<UserDocument>, trackModel: Model<TrackDocument>, progressModel: Model<UserTrackProgressDocument>, sessionModel: Model<SessionDocument>, subscriptionModel: Model<SubscriptionDocument>, planModel: Model<PlanDocument>, codeEvaluationModel: Model<CodeEvaluationDocument>, paymentTransactionModel: Model<PaymentTransactionDocument>, connection: Connection);
    getDashboardStats(): Promise<{
        totalStudents: number;
        activeStudents: number;
        totalTracks: number;
        totalSessions: number;
        upcomingSessions: number;
        sessionsThisWeek: number;
        activeSubscriptions: number;
        monthlyRevenue: number;
        planDistribution: any[];
        recentStudents: (import("mongoose").FlattenMaps<UserDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getSystemUsers(filters?: {
        search?: string;
        role?: string;
        status?: string;
    }): Promise<any>;
    createSystemUser(data: {
        name: string;
        email: string;
        password: string;
        role: string;
        phone?: string;
        bio?: string;
    }): Promise<{
        name: string;
        email: string;
        avatar: string;
        phone: string;
        bio: string;
        github: string;
        linkedin: string;
        plan: string;
        status: string;
        accountStatus: string;
        subscriptionEndDate: Date;
        role: string;
        mentorId: Types.ObjectId;
        streakDays: number;
        totalHours: number;
        notificationPreferences: {
            email: boolean;
            push: boolean;
            mentorReminders: boolean;
            communityUpdates: boolean;
            weeklyReport: boolean;
        };
        stripeCustomerId: string;
        lastLoginAt: Date;
        adminNotes: import("../users/schemas/user.schema").AdminNote[];
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updateSystemUser(userId: string, data: Partial<{
        name: string;
        email: string;
        role: string;
        status: string;
        phone: string;
        bio: string;
        plan: string;
    }>): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteSystemUser(userId: string): Promise<{
        message: string;
    }>;
    assignMentor(studentId: string, mentorId: string | null): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getStudents(filters?: {
        search?: string;
        plan?: string;
        status?: string;
    }): Promise<any>;
    getStudentDetail(studentId: string): Promise<any>;
    createStudent(data: {
        name: string;
        email: string;
        password: string;
        plan?: string;
        phone?: string;
        bio?: string;
    }): Promise<{
        name: string;
        email: string;
        avatar: string;
        phone: string;
        bio: string;
        github: string;
        linkedin: string;
        plan: string;
        status: string;
        accountStatus: string;
        subscriptionEndDate: Date;
        role: string;
        mentorId: Types.ObjectId;
        streakDays: number;
        totalHours: number;
        notificationPreferences: {
            email: boolean;
            push: boolean;
            mentorReminders: boolean;
            communityUpdates: boolean;
            weeklyReport: boolean;
        };
        stripeCustomerId: string;
        lastLoginAt: Date;
        adminNotes: import("../users/schemas/user.schema").AdminNote[];
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }>;
    updateStudent(studentId: string, data: Partial<{
        name: string;
        email: string;
        plan: string;
        status: string;
        phone: string;
        bio: string;
        github: string;
        linkedin: string;
    }>): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteStudent(studentId: string): Promise<{
        message: string;
    }>;
    enrollStudentInTrack(studentId: string, trackId: string): Promise<any>;
    unenrollStudentFromTrack(studentId: string, trackId: string): Promise<any>;
    addStudentNote(studentId: string, adminId: string, content: string): Promise<any>;
    deleteStudentNote(studentId: string, noteId: string): Promise<any>;
    getAllSessions(filters?: {
        status?: string;
        type?: string;
        studentId?: string;
        mentorId?: string;
    }): Promise<(import("mongoose").FlattenMaps<SessionDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSessionDetail(sessionId: string): Promise<any>;
    getMentors(): Promise<any>;
    createSession(adminId: string, data: {
        userId: string;
        title: string;
        description?: string;
        scheduledAt: string;
        durationMinutes?: number;
        type?: string;
        meetingUrl?: string;
        topics?: string[];
    }): Promise<import("mongoose").Document<unknown, {}, SessionDocument, {}, {}> & SessionModel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateSession(sessionId: string, data: Partial<{
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
    }>): Promise<import("mongoose").Document<unknown, {}, SessionDocument, {}, {}> & SessionModel & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteSession(sessionId: string): Promise<{
        message: string;
    }>;
    markSessionNoShow(sessionId: string): Promise<any>;
    addSessionProntuario(sessionId: string, authorId: string, data: {
        subjective?: string;
        objective?: string;
        assessment?: string;
        plan?: string;
        notes?: string;
    }): Promise<any>;
    updateSessionProntuario(sessionId: string, entryId: string, data: {
        subjective?: string;
        objective?: string;
        assessment?: string;
        plan?: string;
        notes?: string;
    }): Promise<any>;
    deleteSessionProntuario(sessionId: string, entryId: string): Promise<any>;
    notifyStudent(sessionId: string): Promise<any>;
    getAllTracks(): Promise<any>;
    createTrack(data: {
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
    }): Promise<import("mongoose").Document<unknown, {}, TrackDocument, {}, {}> & Track & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateTrack(trackId: string, data: Partial<{
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
    }>): Promise<import("mongoose").Document<unknown, {}, TrackDocument, {}, {}> & Track & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    deleteTrack(trackId: string): Promise<{
        message: string;
    }>;
    getAllSubscriptions(filters?: {
        status?: string;
    }): Promise<(import("mongoose").FlattenMaps<SubscriptionDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateSubscription(subscriptionId: string, data: Partial<{
        status: string;
        endDate: string;
        billingCycle: string;
    }>): Promise<import("mongoose").Document<unknown, {}, SubscriptionDocument, {}, {}> & Subscription & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTrackDetail(trackId: string): Promise<any>;
    addTrackDocument(trackId: string, data: {
        title: string;
        description?: string;
        fileUrl: string;
        fileType?: string;
        fileSizeKb?: number;
    }): Promise<any>;
    deleteTrackDocument(trackId: string, documentId: string): Promise<any>;
    getStudentEvaluations(studentId: string): Promise<any>;
    createCodeEvaluation(reviewerId: string, data: {
        studentId: string;
        trackId?: string;
        title: string;
        description?: string;
        language?: string;
        codeSnippet?: string;
        repositoryUrl?: string;
        criteria?: Array<{
            name: string;
            score: number;
            comment?: string;
        }>;
        overallScore?: number;
        status?: string;
        feedback?: string;
        strengths?: string;
        improvements?: string;
    }): Promise<any>;
    updateCodeEvaluation(evaluationId: string, data: Partial<{
        title: string;
        description: string;
        language: string;
        codeSnippet: string;
        repositoryUrl: string;
        criteria: Array<{
            name: string;
            score: number;
            comment?: string;
        }>;
        overallScore: number;
        status: string;
        feedback: string;
        strengths: string;
        improvements: string;
    }>): Promise<any>;
    deleteCodeEvaluation(evaluationId: string): Promise<any>;
    getStudentPayments(studentId: string): Promise<any>;
    createPaymentTransaction(data: {
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
    }): Promise<any>;
    getStudentPaymentSummary(studentId: string): Promise<any>;
}
