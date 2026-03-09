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
exports.UserTrackProgressSchema = exports.UserTrackProgress = exports.LessonProgressSchema = exports.LessonProgress = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let LessonProgress = class LessonProgress {
};
exports.LessonProgress = LessonProgress;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], LessonProgress.prototype, "lessonId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], LessonProgress.prototype, "completed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], LessonProgress.prototype, "completedAt", void 0);
exports.LessonProgress = LessonProgress = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], LessonProgress);
exports.LessonProgressSchema = mongoose_1.SchemaFactory.createForClass(LessonProgress);
let UserTrackProgress = class UserTrackProgress {
};
exports.UserTrackProgress = UserTrackProgress;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], UserTrackProgress.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Track', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], UserTrackProgress.prototype, "trackId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' }),
    __metadata("design:type", String)
], UserTrackProgress.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserTrackProgress.prototype, "progressPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], UserTrackProgress.prototype, "completedLessons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.LessonProgressSchema], default: [] }),
    __metadata("design:type", Array)
], UserTrackProgress.prototype, "lessonProgress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], UserTrackProgress.prototype, "startedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], UserTrackProgress.prototype, "completedAt", void 0);
exports.UserTrackProgress = UserTrackProgress = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], UserTrackProgress);
exports.UserTrackProgressSchema = mongoose_1.SchemaFactory.createForClass(UserTrackProgress);
exports.UserTrackProgressSchema.index({ userId: 1, trackId: 1 }, { unique: true });
//# sourceMappingURL=user-track-progress.schema.js.map