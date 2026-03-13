"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const google_calendar_service_1 = require("../google-calendar/google-calendar.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let AdminController = class AdminController {
    constructor(adminService, googleCalendarService) {
        this.adminService = adminService;
        this.googleCalendarService = googleCalendarService;
    }
    async getDashboard() {
        return this.adminService.getDashboardStats();
    }
    async getSystemUsers(search, role, status) {
        return this.adminService.getSystemUsers({ search, role, status });
    }
    async createSystemUser(data) {
        return this.adminService.createSystemUser(data);
    }
    async updateSystemUser(id, data) {
        return this.adminService.updateSystemUser(id, data);
    }
    async deleteSystemUser(id) {
        return this.adminService.deleteSystemUser(id);
    }
    async getStudents(search, plan, status) {
        return this.adminService.getStudents({ search, plan, status });
    }
    async getStudentDetail(id) {
        return this.adminService.getStudentDetail(id);
    }
    async createStudent(data) {
        return this.adminService.createStudent(data);
    }
    async updateStudent(id, data) {
        return this.adminService.updateStudent(id, data);
    }
    async deleteStudent(id) {
        return this.adminService.deleteStudent(id);
    }
    async assignMentor(studentId, mentorId) {
        return this.adminService.assignMentor(studentId, mentorId);
    }
    async grantAccess(studentId, adminId, data) {
        return this.adminService.grantAccess(studentId, adminId, data);
    }
    async revokeAccess(studentId, adminId, data) {
        return this.adminService.revokeAccess(studentId, adminId, data.reason);
    }
    async enrollStudentInTrack(studentId, trackId) {
        return this.adminService.enrollStudentInTrack(studentId, trackId);
    }
    async unenrollStudentFromTrack(studentId, trackId) {
        return this.adminService.unenrollStudentFromTrack(studentId, trackId);
    }
    async addStudentNote(studentId, adminId, content) {
        return this.adminService.addStudentNote(studentId, adminId, content);
    }
    async deleteStudentNote(studentId, noteId) {
        return this.adminService.deleteStudentNote(studentId, noteId);
    }
    async getGoogleCalendarStatus() {
        return { configured: this.googleCalendarService.isConfigured() };
    }
    async getSessions(status, type, studentId, mentorId) {
        return this.adminService.getAllSessions({ status, type, studentId, mentorId });
    }
    async getSessionDetail(id) {
        return this.adminService.getSessionDetail(id);
    }
    async getMentors() {
        return this.adminService.getMentors();
    }
    async createSession(adminId, data) {
        return this.adminService.createSession(data.mentorId || adminId, data);
    }
    async updateSession(id, data) {
        return this.adminService.updateSession(id, data);
    }
    async deleteSession(id) {
        return this.adminService.deleteSession(id);
    }
    async markSessionNoShow(id) {
        return this.adminService.markSessionNoShow(id);
    }
    async addSessionProntuario(sessionId, authorId, data) {
        return this.adminService.addSessionProntuario(sessionId, authorId, data);
    }
    async updateSessionProntuario(sessionId, entryId, data) {
        return this.adminService.updateSessionProntuario(sessionId, entryId, data);
    }
    async deleteSessionProntuario(sessionId, entryId) {
        return this.adminService.deleteSessionProntuario(sessionId, entryId);
    }
    async notifyStudent(id) {
        return this.adminService.notifyStudent(id);
    }
    async getTracks() {
        return this.adminService.getAllTracks();
    }
    async createTrack(data) {
        return this.adminService.createTrack(data);
    }
    async updateTrack(id, data) {
        return this.adminService.updateTrack(id, data);
    }
    async deleteTrack(id) {
        return this.adminService.deleteTrack(id);
    }
    async getSubscriptions(status) {
        return this.adminService.getAllSubscriptions({ status });
    }
    async updateSubscription(id, data) {
        return this.adminService.updateSubscription(id, data);
    }
    async getTrackDetail(id) {
        return this.adminService.getTrackDetail(id);
    }
    async addTrackDocument(trackId, data) {
        return this.adminService.addTrackDocument(trackId, data);
    }
    async deleteTrackDocument(trackId, documentId) {
        return this.adminService.deleteTrackDocument(trackId, documentId);
    }
    async getStudentEvaluations(studentId) {
        return this.adminService.getStudentEvaluations(studentId);
    }
    async createCodeEvaluation(reviewerId, data) {
        return this.adminService.createCodeEvaluation(reviewerId, data);
    }
    async updateCodeEvaluation(id, data) {
        return this.adminService.updateCodeEvaluation(id, data);
    }
    async deleteCodeEvaluation(id) {
        return this.adminService.deleteCodeEvaluation(id);
    }
    async getStudentPayments(studentId) {
        return this.adminService.getStudentPayments(studentId);
    }
    async getStudentPaymentSummary(studentId) {
        return this.adminService.getStudentPaymentSummary(studentId);
    }
    async createPaymentTransaction(data) {
        return this.adminService.createPaymentTransaction(data);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('role')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSystemUser", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSystemUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSystemUser", null);
__decorate([
    (0, common_1.Get)('students'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('plan')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)('students/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudentDetail", null);
__decorate([
    (0, common_1.Post)('students'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createStudent", null);
__decorate([
    (0, common_1.Put)('students/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateStudent", null);
__decorate([
    (0, common_1.Delete)('students/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteStudent", null);
__decorate([
    (0, common_1.Put)('students/:id/mentor'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('mentorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignMentor", null);
__decorate([
    (0, common_1.Post)('students/:id/grant-access'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "grantAccess", null);
__decorate([
    (0, common_1.Post)('students/:id/revoke-access'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "revokeAccess", null);
__decorate([
    (0, common_1.Post)('students/:id/tracks'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('trackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "enrollStudentInTrack", null);
__decorate([
    (0, common_1.Delete)('students/:studentId/tracks/:trackId'),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Param)('trackId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "unenrollStudentFromTrack", null);
__decorate([
    (0, common_1.Post)('students/:id/notes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addStudentNote", null);
__decorate([
    (0, common_1.Delete)('students/:studentId/notes/:noteId'),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteStudentNote", null);
__decorate([
    (0, common_1.Get)('sessions/google-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getGoogleCalendarStatus", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('studentId')),
    __param(3, (0, common_1.Query)('mentorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSessionDetail", null);
__decorate([
    (0, common_1.Get)('mentors'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMentors", null);
__decorate([
    (0, common_1.Post)('sessions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createSession", null);
__decorate([
    (0, common_1.Put)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSession", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Put)('sessions/:id/no-show'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "markSessionNoShow", null);
__decorate([
    (0, common_1.Post)('sessions/:id/prontuario'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addSessionProntuario", null);
__decorate([
    (0, common_1.Put)('sessions/:sessionId/prontuario/:entryId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Param)('entryId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSessionProntuario", null);
__decorate([
    (0, common_1.Delete)('sessions/:sessionId/prontuario/:entryId'),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Param)('entryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteSessionProntuario", null);
__decorate([
    (0, common_1.Post)('sessions/:id/notify'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "notifyStudent", null);
__decorate([
    (0, common_1.Get)('tracks'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTracks", null);
__decorate([
    (0, common_1.Post)('tracks'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createTrack", null);
__decorate([
    (0, common_1.Put)('tracks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateTrack", null);
__decorate([
    (0, common_1.Delete)('tracks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTrack", null);
__decorate([
    (0, common_1.Get)('subscriptions'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSubscriptions", null);
__decorate([
    (0, common_1.Put)('subscriptions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateSubscription", null);
__decorate([
    (0, common_1.Get)('tracks/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTrackDetail", null);
__decorate([
    (0, common_1.Post)('tracks/:id/documents'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addTrackDocument", null);
__decorate([
    (0, common_1.Delete)('tracks/:trackId/documents/:documentId'),
    __param(0, (0, common_1.Param)('trackId')),
    __param(1, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteTrackDocument", null);
__decorate([
    (0, common_1.Get)('students/:id/evaluations'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudentEvaluations", null);
__decorate([
    (0, common_1.Post)('evaluations'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createCodeEvaluation", null);
__decorate([
    (0, common_1.Put)('evaluations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateCodeEvaluation", null);
__decorate([
    (0, common_1.Delete)('evaluations/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteCodeEvaluation", null);
__decorate([
    (0, common_1.Get)('students/:id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudentPayments", null);
__decorate([
    (0, common_1.Get)('students/:id/payments/summary'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStudentPaymentSummary", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createPaymentTransaction", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        google_calendar_service_1.GoogleCalendarService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map