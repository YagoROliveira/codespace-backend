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
exports.InterviewSessionSchema = exports.InterviewSession = exports.InterviewAnswerSchema = exports.InterviewAnswer = exports.InterviewQuestionSchema = exports.InterviewQuestion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let InterviewQuestion = class InterviewQuestion {
};
exports.InterviewQuestion = InterviewQuestion;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "question", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "hints", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "idealAnswer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['behavioral', 'technical', 'coding', 'system-design'], default: 'technical' }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['junior', 'pleno', 'senior', 'lead'], default: 'junior' }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], InterviewQuestion.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], InterviewQuestion.prototype, "company", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 5 }),
    __metadata("design:type", Number)
], InterviewQuestion.prototype, "timeLimitMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], InterviewQuestion.prototype, "isActive", void 0);
exports.InterviewQuestion = InterviewQuestion = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InterviewQuestion);
exports.InterviewQuestionSchema = mongoose_1.SchemaFactory.createForClass(InterviewQuestion);
exports.InterviewQuestionSchema.index({ isActive: 1, type: 1, level: 1 });
let InterviewAnswer = class InterviewAnswer {
};
exports.InterviewAnswer = InterviewAnswer;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InterviewAnswer.prototype, "questionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], InterviewAnswer.prototype, "answer", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], InterviewAnswer.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], InterviewAnswer.prototype, "feedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], InterviewAnswer.prototype, "timeSpentSeconds", void 0);
exports.InterviewAnswer = InterviewAnswer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InterviewAnswer);
exports.InterviewAnswerSchema = mongoose_1.SchemaFactory.createForClass(InterviewAnswer);
let InterviewSession = class InterviewSession {
};
exports.InterviewSession = InterviewSession;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], InterviewSession.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['behavioral', 'technical', 'coding', 'system-design', 'mixed'], default: 'mixed' }),
    __metadata("design:type", String)
], InterviewSession.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['junior', 'pleno', 'senior', 'lead'], default: 'junior' }),
    __metadata("design:type", String)
], InterviewSession.prototype, "level", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' }),
    __metadata("design:type", String)
], InterviewSession.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.InterviewAnswerSchema], default: [] }),
    __metadata("design:type", Array)
], InterviewSession.prototype, "answers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], InterviewSession.prototype, "totalScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], InterviewSession.prototype, "totalQuestions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], InterviewSession.prototype, "answeredQuestions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], InterviewSession.prototype, "overallFeedback", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], InterviewSession.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], InterviewSession.prototype, "completedAt", void 0);
exports.InterviewSession = InterviewSession = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], InterviewSession);
exports.InterviewSessionSchema = mongoose_1.SchemaFactory.createForClass(InterviewSession);
exports.InterviewSessionSchema.index({ userId: 1, status: 1 });
//# sourceMappingURL=interview.schema.js.map