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
exports.CodeEvaluationSchema = exports.CodeEvaluation = exports.EvaluationCriterionSchema = exports.EvaluationCriterion = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let EvaluationCriterion = class EvaluationCriterion {
};
exports.EvaluationCriterion = EvaluationCriterion;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], EvaluationCriterion.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0, max: 10 }),
    __metadata("design:type", Number)
], EvaluationCriterion.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], EvaluationCriterion.prototype, "comment", void 0);
exports.EvaluationCriterion = EvaluationCriterion = __decorate([
    (0, mongoose_1.Schema)()
], EvaluationCriterion);
exports.EvaluationCriterionSchema = mongoose_1.SchemaFactory.createForClass(EvaluationCriterion);
let CodeEvaluation = class CodeEvaluation {
};
exports.CodeEvaluation = CodeEvaluation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CodeEvaluation.prototype, "studentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CodeEvaluation.prototype, "reviewerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Track' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CodeEvaluation.prototype, "trackId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "codeSnippet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "repositoryUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.EvaluationCriterionSchema], default: [] }),
    __metadata("design:type", Array)
], CodeEvaluation.prototype, "criteria", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 10 }),
    __metadata("design:type", Number)
], CodeEvaluation.prototype, "overallScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'in_review', 'completed', 'revision_requested'], default: 'pending' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "feedback", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "strengths", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CodeEvaluation.prototype, "improvements", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], CodeEvaluation.prototype, "evaluatedAt", void 0);
exports.CodeEvaluation = CodeEvaluation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CodeEvaluation);
exports.CodeEvaluationSchema = mongoose_1.SchemaFactory.createForClass(CodeEvaluation);
exports.CodeEvaluationSchema.index({ studentId: 1, createdAt: -1 });
exports.CodeEvaluationSchema.index({ reviewerId: 1 });
exports.CodeEvaluationSchema.index({ status: 1 });
exports.CodeEvaluationSchema.index({ trackId: 1 });
//# sourceMappingURL=code-evaluation.schema.js.map