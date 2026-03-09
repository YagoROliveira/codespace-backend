import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboard(): Promise<any>;
    getSystemUsers(search?: string, role?: string, status?: string): Promise<any>;
    createSystemUser(data: {
        name: string;
        email: string;
        password: string;
        role: string;
        phone?: string;
        bio?: string;
    }): Promise<any>;
    updateSystemUser(id: string, data: Record<string, any>): Promise<any>;
    deleteSystemUser(id: string): Promise<any>;
    getStudents(search?: string, plan?: string, status?: string): Promise<any>;
    getStudentDetail(id: string): Promise<any>;
    createStudent(data: {
        name: string;
        email: string;
        password: string;
        plan?: string;
        phone?: string;
        bio?: string;
    }): Promise<any>;
    updateStudent(id: string, data: Record<string, any>): Promise<any>;
    deleteStudent(id: string): Promise<any>;
    assignMentor(studentId: string, mentorId: string | null): Promise<any>;
    enrollStudentInTrack(studentId: string, trackId: string): Promise<any>;
    unenrollStudentFromTrack(studentId: string, trackId: string): Promise<any>;
    addStudentNote(studentId: string, adminId: string, content: string): Promise<any>;
    deleteStudentNote(studentId: string, noteId: string): Promise<any>;
    getSessions(status?: string, type?: string, studentId?: string, mentorId?: string): Promise<any>;
    getSessionDetail(id: string): Promise<any>;
    getMentors(): Promise<any>;
    createSession(adminId: string, data: {
        userId: string;
        mentorId?: string;
        title: string;
        description?: string;
        scheduledAt: string;
        durationMinutes?: number;
        type?: string;
        meetingUrl?: string;
        topics?: string[];
    }): Promise<any>;
    updateSession(id: string, data: Record<string, any>): Promise<any>;
    deleteSession(id: string): Promise<any>;
    markSessionNoShow(id: string): Promise<any>;
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
    notifyStudent(id: string): Promise<any>;
    getTracks(): Promise<any>;
    createTrack(data: any): Promise<any>;
    updateTrack(id: string, data: Record<string, any>): Promise<any>;
    deleteTrack(id: string): Promise<any>;
    getSubscriptions(status?: string): Promise<any>;
    updateSubscription(id: string, data: Record<string, any>): Promise<any>;
    getTrackDetail(id: string): Promise<any>;
    addTrackDocument(trackId: string, data: {
        title: string;
        description?: string;
        fileUrl: string;
        fileType?: string;
        fileSizeKb?: number;
    }): Promise<any>;
    deleteTrackDocument(trackId: string, documentId: string): Promise<any>;
    getStudentEvaluations(studentId: string): Promise<any>;
    createCodeEvaluation(reviewerId: string, data: any): Promise<any>;
    updateCodeEvaluation(id: string, data: Record<string, any>): Promise<any>;
    deleteCodeEvaluation(id: string): Promise<any>;
    getStudentPayments(studentId: string): Promise<any>;
    getStudentPaymentSummary(studentId: string): Promise<any>;
    createPaymentTransaction(data: any): Promise<any>;
}
