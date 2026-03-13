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
exports.TrackSchema = exports.Track = exports.TrackDocumentSchema = exports.TrackDocument_ = exports.LessonSchema = exports.Lesson = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Lesson = class Lesson {
};
exports.Lesson = Lesson;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Lesson.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Lesson.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Lesson.prototype, "videoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Lesson.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Lesson.prototype, "durationMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Lesson.prototype, "order", void 0);
exports.Lesson = Lesson = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Lesson);
exports.LessonSchema = mongoose_1.SchemaFactory.createForClass(Lesson);
let TrackDocument_ = class TrackDocument_ {
};
exports.TrackDocument_ = TrackDocument_;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TrackDocument_.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TrackDocument_.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], TrackDocument_.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], TrackDocument_.prototype, "fileUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], TrackDocument_.prototype, "fileType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], TrackDocument_.prototype, "fileSizeKb", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: () => new Date() }),
    __metadata("design:type", Date)
], TrackDocument_.prototype, "uploadedAt", void 0);
exports.TrackDocument_ = TrackDocument_ = __decorate([
    (0, mongoose_1.Schema)()
], TrackDocument_);
exports.TrackDocumentSchema = mongoose_1.SchemaFactory.createForClass(TrackDocument_);
let Track = class Track {
};
exports.Track = Track;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Track.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Track.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Track.prototype, "icon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Track.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Track.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' }),
    __metadata("design:type", String)
], Track.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Track.prototype, "totalLessons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Track.prototype, "estimatedHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.LessonSchema], default: [] }),
    __metadata("design:type", Array)
], Track.prototype, "lessons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], enum: ['free', 'essencial', 'profissional', 'elite'], default: ['free'] }),
    __metadata("design:type", Array)
], Track.prototype, "requiredPlans", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Track.prototype, "isPublished", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Track.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.TrackDocumentSchema], default: [] }),
    __metadata("design:type", Array)
], Track.prototype, "documents", void 0);
exports.Track = Track = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Track);
exports.TrackSchema = mongoose_1.SchemaFactory.createForClass(Track);
exports.TrackSchema.index({ isPublished: 1, order: 1 });
//# sourceMappingURL=track.schema.js.map