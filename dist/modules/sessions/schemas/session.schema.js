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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSchema = exports.Session = exports.ProntuarioEntry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
class ProntuarioEntry {
}
exports.ProntuarioEntry = ProntuarioEntry;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, default: () => new mongoose_2.Types.ObjectId() }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ProntuarioEntry.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ProntuarioEntry.prototype, "subjective", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ProntuarioEntry.prototype, "objective", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ProntuarioEntry.prototype, "assessment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ProntuarioEntry.prototype, "plan", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ProntuarioEntry.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], ProntuarioEntry.prototype, "authorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ProntuarioEntry.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], ProntuarioEntry.prototype, "updatedAt", void 0);
let Session = class Session {
};
exports.Session = Session;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Session.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Session.prototype, "mentorId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Session.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Session.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Session.prototype, "scheduledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 60 }),
    __metadata("design:type", Number)
], Session.prototype, "durationMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'], default: 'scheduled' }),
    __metadata("design:type", String)
], Session.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Session.prototype, "meetingUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Session.prototype, "recordingUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Session.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Session.prototype, "calendarEventId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Session.prototype, "topics", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['mentoring', 'code_review', 'mock_interview', 'pair_programming'], default: 'mentoring' }),
    __metadata("design:type", String)
], Session.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Session.prototype, "studentNoShow", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Session.prototype, "noShowMarkedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                _id: { type: mongoose_2.Types.ObjectId, default: () => new mongoose_2.Types.ObjectId() },
                subjective: { type: String, default: '' },
                objective: { type: String, default: '' },
                assessment: { type: String, default: '' },
                plan: { type: String, default: '' },
                notes: { type: String, default: '' },
                authorId: { type: String },
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now },
            }],
        default: [],
    }),
    __metadata("design:type", Array)
], Session.prototype, "prontuario", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Session.prototype, "lastNotifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Session.prototype, "notificationCount", void 0);
exports.Session = Session = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Session);
exports.SessionSchema = mongoose_1.SchemaFactory.createForClass(Session);
exports.SessionSchema.index({ userId: 1, scheduledAt: -1 });
exports.SessionSchema.index({ mentorId: 1, scheduledAt: -1 });
exports.SessionSchema.index({ status: 1, scheduledAt: -1 });
//# sourceMappingURL=session.schema.js.map