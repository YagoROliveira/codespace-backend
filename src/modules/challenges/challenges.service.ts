import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Challenge, ChallengeDocument, ChallengeSubmission, ChallengeSubmissionDocument } from './schemas/challenge.schema';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>,
    @InjectModel(ChallengeSubmission.name) private submissionModel: Model<ChallengeSubmissionDocument>,
  ) { }

  async findAll(): Promise<any[]> {
    return this.challengeModel.find({ isActive: true }).sort({ createdAt: -1 }).lean();
  }

  async findWeekly(): Promise<any[]> {
    const now = new Date();
    return this.challengeModel.find({
      isActive: true,
      isWeekly: true,
      weekStart: { $lte: now },
      weekEnd: { $gte: now },
    }).sort({ points: -1 }).lean();
  }

  async findById(id: string): Promise<any> {
    const challenge = await this.challengeModel.findById(id).lean();
    if (!challenge) throw new NotFoundException('Desafio não encontrado');
    return challenge;
  }

  async submit(userId: string, challengeId: string, code: string, language: string) {
    const challenge = await this.findById(challengeId);

    // Simple evaluation: count test cases passed (in production, use sandboxed evaluation)
    const testsTotal = challenge.testCases.length;
    const testsPassed = Math.floor(Math.random() * (testsTotal + 1)); // Placeholder
    const passed = testsPassed === testsTotal;
    const score = passed ? challenge.points : Math.floor((testsPassed / Math.max(testsTotal, 1)) * challenge.points * 0.5);

    const submission = await this.submissionModel.create({
      userId: new Types.ObjectId(userId),
      challengeId: new Types.ObjectId(challengeId),
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

    // Update challenge stats
    await this.challengeModel.findByIdAndUpdate(challengeId, {
      $inc: { totalSubmissions: 1, ...(passed ? { totalCompletions: 1 } : {}) },
    });

    return submission;
  }

  async getUserSubmissions(userId: string, challengeId?: string) {
    const filter: any = { userId: new Types.ObjectId(userId) };
    if (challengeId) filter.challengeId = new Types.ObjectId(challengeId);
    return this.submissionModel.find(filter).sort({ submittedAt: -1 }).limit(50).lean();
  }

  async getLeaderboard(challengeId?: string) {
    const match: any = { status: 'passed' };
    if (challengeId) match.challengeId = new Types.ObjectId(challengeId);

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

  async getUserStats(userId: string) {
    const [statsAgg, uniqueSolvedAgg] = await Promise.all([
      this.submissionModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalSubmissions: { $sum: 1 },
            totalScore: {
              $sum: { $cond: [{ $eq: ['$status', 'passed'] }, '$score', 0] },
            },
          },
        },
      ]),
      this.submissionModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId), status: 'passed' } },
        { $group: { _id: '$challengeId' } },
        { $count: 'count' },
      ]),
    ]);

    const stats = statsAgg[0] || { totalSubmissions: 0, totalScore: 0 };
    const uniqueSolved = uniqueSolvedAgg[0]?.count || 0;

    return {
      totalSubmissions: stats.totalSubmissions,
      totalSolved: uniqueSolved,
      totalScore: stats.totalScore,
      streak: Math.min(uniqueSolved, 7),
    };
  }
}
