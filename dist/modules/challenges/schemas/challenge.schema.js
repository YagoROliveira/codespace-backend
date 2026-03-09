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
exports.ChallengeSubmissionSchema = exports.ChallengeSubmission = exports.ChallengeSchema = exports.Challenge = exports.TestCaseSchema = exports.TestCase = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TestCase = class TestCase {
};
exports.TestCase = TestCase;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestCase.prototype, "input", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TestCase.prototype, "expectedOutput", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TestCase.prototype, "isHidden", void 0);
exports.TestCase = TestCase = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TestCase);
exports.TestCaseSchema = mongoose_1.SchemaFactory.createForClass(TestCase);
let Challenge = class Challenge {
};
exports.Challenge = Challenge;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Challenge.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Challenge.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Challenge.prototype, "instructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['easy', 'medium', 'hard', 'expert'], default: 'easy' }),
    __metadata("design:type", String)
], Challenge.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Challenge.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Challenge.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Challenge.prototype, "points", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Challenge.prototype, "starterCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Challenge.prototype, "solutionCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.TestCaseSchema], default: [] }),
    __metadata("design:type", Array)
], Challenge.prototype, "testCases", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Challenge.prototype, "timeLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Challenge.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Challenge.prototype, "weekStart", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Challenge.prototype, "weekEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Challenge.prototype, "isWeekly", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Challenge.prototype, "totalSubmissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Challenge.prototype, "totalCompletions", void 0);
exports.Challenge = Challenge = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Challenge);
exports.ChallengeSchema = mongoose_1.SchemaFactory.createForClass(Challenge);
let ChallengeSubmission = class ChallengeSubmission {
};
exports.ChallengeSubmission = ChallengeSubmission;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChallengeSubmission.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Challenge', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ChallengeSubmission.prototype, "challengeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ChallengeSubmission.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'javascript' }),
    __metadata("design:type", String)
], ChallengeSubmission.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['pending', 'passed', 'failed', 'error'], default: 'pending' }),
    __metadata("design:type", String)
], ChallengeSubmission.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ChallengeSubmission.prototype, "score", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ChallengeSubmission.prototype, "testsTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ChallengeSubmission.prototype, "testsPassed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ChallengeSubmission.prototype, "executionTimeMs", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], ChallengeSubmission.prototype, "feedback", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ChallengeSubmission.prototype, "submittedAt", void 0);
exports.ChallengeSubmission = ChallengeSubmission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ChallengeSubmission);
exports.ChallengeSubmissionSchema = mongoose_1.SchemaFactory.createForClass(ChallengeSubmission);
exports.ChallengeSubmissionSchema.index({ userId: 1, challengeId: 1 });
//# sourceMappingURL=challenge.schema.js.map