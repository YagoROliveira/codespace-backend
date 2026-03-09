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
exports.ChallengesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const challenge_schema_1 = require("./schemas/challenge.schema");
let ChallengesService = class ChallengesService {
    constructor(challengeModel, submissionModel) {
        this.challengeModel = challengeModel;
        this.submissionModel = submissionModel;
    }
    async findAll() {
        return this.challengeModel.find({ isActive: true }).sort({ createdAt: -1 });
    }
    async findWeekly() {
        const now = new Date();
        return this.challengeModel.find({
            isActive: true,
            isWeekly: true,
            weekStart: { $lte: now },
            weekEnd: { $gte: now },
        }).sort({ points: -1 });
    }
    async findById(id) {
        const challenge = await this.challengeModel.findById(id);
        if (!challenge)
            throw new common_1.NotFoundException('Desafio não encontrado');
        return challenge;
    }
    async submit(userId, challengeId, code, language) {
        const challenge = await this.findById(challengeId);
        const testsTotal = challenge.testCases.length;
        const testsPassed = Math.floor(Math.random() * (testsTotal + 1));
        const passed = testsPassed === testsTotal;
        const score = passed ? challenge.points : Math.floor((testsPassed / Math.max(testsTotal, 1)) * challenge.points * 0.5);
        const submission = await this.submissionModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            challengeId: new mongoose_2.Types.ObjectId(challengeId),
            code,
            language,
            status: passed ? 'passed' : 'failed',
            score,
            testsTotal,
            testsPassed,
            executionTimeMs: Math.floor(Math.random() * 500) + 50,
            feedback: passed ? 'Todos os testes passaram! Excelente trabalho!' : `${testsPassed}/${testsTotal} testes passaram. Continue tentando!`,
            submittedAt: new Date(),
        });
        await this.challengeModel.findByIdAndUpdate(challengeId, {
            $inc: { totalSubmissions: 1, ...(passed ? { totalCompletions: 1 } : {}) },
        });
        return submission;
    }
    async getUserSubmissions(userId, challengeId) {
        const filter = { userId: new mongoose_2.Types.ObjectId(userId) };
        if (challengeId)
            filter.challengeId = new mongoose_2.Types.ObjectId(challengeId);
        return this.submissionModel.find(filter).sort({ submittedAt: -1 }).limit(50);
    }
    async getLeaderboard(challengeId) {
        const match = { status: 'passed' };
        if (challengeId)
            match.challengeId = new mongoose_2.Types.ObjectId(challengeId);
        return this.submissionModel.aggregate([
            { $match: match },
            { $group: { _id: '$userId', totalScore: { $sum: '$score' }, totalSolved: { $sum: 1 }, bestTime: { $min: '$executionTimeMs' } } },
            { $sort: { totalScore: -1 } },
            { $limit: 50 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            { $project: { _id: 1, totalScore: 1, totalSolved: 1, bestTime: 1, 'user.name': 1, 'user.avatar': 1, 'user.plan': 1 } },
        ]);
    }
    async getUserStats(userId) {
        const submissions = await this.submissionModel.find({ userId: new mongoose_2.Types.ObjectId(userId) });
        const passed = submissions.filter(s => s.status === 'passed');
        const uniqueSolved = new Set(passed.map(s => s.challengeId.toString())).size;
        return {
            totalSubmissions: submissions.length,
            totalSolved: uniqueSolved,
            totalScore: passed.reduce((sum, s) => sum + s.score, 0),
            streak: Math.min(uniqueSolved, 7),
        };
    }
};
exports.ChallengesService = ChallengesService;
exports.ChallengesService = ChallengesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(challenge_schema_1.Challenge.name)),
    __param(1, (0, mongoose_1.InjectModel)(challenge_schema_1.ChallengeSubmission.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChallengesService);
//# sourceMappingURL=challenges.service.js.map