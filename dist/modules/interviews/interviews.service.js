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
exports.InterviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const interview_schema_1 = require("./schemas/interview.schema");
let InterviewsService = class InterviewsService {
    constructor(questionModel, sessionModel) {
        this.questionModel = questionModel;
        this.sessionModel = sessionModel;
    }
    async getQuestions(type, level) {
        const query = { isActive: true };
        if (type)
            query.type = type;
        if (level)
            query.level = level;
        return this.questionModel.find(query).sort({ createdAt: -1 });
    }
    async startSession(userId, type, level, questionCount = 5) {
        const query = { isActive: true };
        if (type && type !== 'mixed')
            query.type = type;
        if (level)
            query.level = level;
        const questions = await this.questionModel.aggregate([
            { $match: query },
            { $sample: { size: questionCount } },
        ]);
        const session = await this.sessionModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            type,
            level,
            status: 'in_progress',
            totalQuestions: questions.length,
            answeredQuestions: 0,
            answers: questions.map(q => ({
                questionId: q._id,
                answer: '',
                score: 0,
                feedback: '',
                timeSpentSeconds: 0,
            })),
            startedAt: new Date(),
        });
        return { session, questions };
    }
    async submitAnswer(userId, sessionId, questionId, answer, timeSpent) {
        const session = await this.sessionModel.findOne({ _id: sessionId, userId: new mongoose_2.Types.ObjectId(userId) });
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        const question = await this.questionModel.findById(questionId);
        if (!question)
            throw new common_1.NotFoundException('Pergunta não encontrada');
        const keywords = question.idealAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const answerLower = answer.toLowerCase();
        const matchCount = keywords.filter(k => answerLower.includes(k)).length;
        const score = Math.min(100, Math.round((matchCount / Math.max(keywords.length, 1)) * 80) + (answer.length > 50 ? 20 : Math.round(answer.length / 2.5)));
        let feedback = '';
        if (score >= 80)
            feedback = 'Excelente resposta! Cobriu os pontos principais.';
        else if (score >= 60)
            feedback = 'Boa resposta, mas poderia aprofundar mais em alguns pontos.';
        else if (score >= 40)
            feedback = 'Resposta razoável. Tente abordar mais conceitos-chave.';
        else
            feedback = 'Resposta precisa de mais profundidade. Revise o tema e tente novamente.';
        const answerIdx = session.answers.findIndex(a => a.questionId.toString() === questionId);
        if (answerIdx < 0)
            throw new common_1.NotFoundException('Pergunta não pertence a esta sessão');
        session.answers[answerIdx].answer = answer;
        session.answers[answerIdx].score = score;
        session.answers[answerIdx].feedback = feedback;
        session.answers[answerIdx].timeSpentSeconds = timeSpent;
        session.answeredQuestions = session.answers.filter(a => a.answer.length > 0).length;
        if (session.answeredQuestions === session.totalQuestions) {
            session.status = 'completed';
            session.completedAt = new Date();
            session.totalScore = Math.round(session.answers.reduce((sum, a) => sum + a.score, 0) / session.totalQuestions);
            if (session.totalScore >= 80)
                session.overallFeedback = 'Performance excelente! Você está preparado para entrevistas reais.';
            else if (session.totalScore >= 60)
                session.overallFeedback = 'Bom desempenho! Ainda há alguns pontos para melhorar.';
            else
                session.overallFeedback = 'Continue praticando. Foque nos temas que tiveram menor pontuação.';
        }
        await session.save();
        return { score, feedback, session };
    }
    async getUserSessions(userId) {
        return this.sessionModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ startedAt: -1 }).limit(20);
    }
    async getSessionById(userId, sessionId) {
        const session = await this.sessionModel.findOne({ _id: sessionId, userId: new mongoose_2.Types.ObjectId(userId) });
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        const questionIds = session.answers.map(a => a.questionId);
        const questions = await this.questionModel.find({ _id: { $in: questionIds } });
        return { session, questions };
    }
    async getUserStats(userId) {
        const sessions = await this.sessionModel.find({ userId: new mongoose_2.Types.ObjectId(userId), status: 'completed' });
        return {
            totalSessions: sessions.length,
            avgScore: sessions.length ? Math.round(sessions.reduce((s, ss) => s + ss.totalScore, 0) / sessions.length) : 0,
            bestScore: sessions.length ? Math.max(...sessions.map(s => s.totalScore)) : 0,
            totalQuestions: sessions.reduce((s, ss) => s + ss.totalQuestions, 0),
        };
    }
};
exports.InterviewsService = InterviewsService;
exports.InterviewsService = InterviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(interview_schema_1.InterviewQuestion.name)),
    __param(1, (0, mongoose_1.InjectModel)(interview_schema_1.InterviewSession.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], InterviewsService);
//# sourceMappingURL=interviews.service.js.map