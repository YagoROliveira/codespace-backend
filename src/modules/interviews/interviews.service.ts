import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { InterviewQuestion, InterviewQuestionDocument, InterviewSession, InterviewSessionDocument } from './schemas/interview.schema';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectModel(InterviewQuestion.name) private questionModel: Model<InterviewQuestionDocument>,
    @InjectModel(InterviewSession.name) private sessionModel: Model<InterviewSessionDocument>,
  ) { }

  async getQuestions(type?: string, level?: string): Promise<InterviewQuestionDocument[]> {
    const query: any = { isActive: true };
    if (type) query.type = type;
    if (level) query.level = level;
    return this.questionModel.find(query).sort({ createdAt: -1 });
  }

  async startSession(userId: string, type: string, level: string, questionCount: number = 5) {
    const query: any = { isActive: true };
    if (type && type !== 'mixed') query.type = type;
    if (level) query.level = level;

    const questions = await this.questionModel.aggregate([
      { $match: query },
      { $sample: { size: questionCount } },
    ]);

    const session = await this.sessionModel.create({
      userId: new Types.ObjectId(userId),
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

  async submitAnswer(userId: string, sessionId: string, questionId: string, answer: string, timeSpent: number) {
    const session = await this.sessionModel.findOne({ _id: sessionId, userId: new Types.ObjectId(userId) });
    if (!session) throw new NotFoundException('Sessão não encontrada');

    const question = await this.questionModel.findById(questionId);
    if (!question) throw new NotFoundException('Pergunta não encontrada');

    // Simple scoring heuristic based on answer length and keyword matching
    const keywords = question.idealAnswer.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const answerLower = answer.toLowerCase();
    const matchCount = keywords.filter(k => answerLower.includes(k)).length;
    const score = Math.min(100, Math.round((matchCount / Math.max(keywords.length, 1)) * 80) + (answer.length > 50 ? 20 : Math.round(answer.length / 2.5)));

    let feedback = '';
    if (score >= 80) feedback = 'Excelente resposta! Cobriu os pontos principais.';
    else if (score >= 60) feedback = 'Boa resposta, mas poderia aprofundar mais em alguns pontos.';
    else if (score >= 40) feedback = 'Resposta razoável. Tente abordar mais conceitos-chave.';
    else feedback = 'Resposta precisa de mais profundidade. Revise o tema e tente novamente.';

    const answerIdx = session.answers.findIndex(a => a.questionId.toString() === questionId);
    if (answerIdx < 0) throw new NotFoundException('Pergunta não pertence a esta sessão');

    session.answers[answerIdx].answer = answer;
    session.answers[answerIdx].score = score;
    session.answers[answerIdx].feedback = feedback;
    session.answers[answerIdx].timeSpentSeconds = timeSpent;

    session.answeredQuestions = session.answers.filter(a => a.answer.length > 0).length;

    if (session.answeredQuestions === session.totalQuestions) {
      session.status = 'completed';
      session.completedAt = new Date();
      session.totalScore = Math.round(session.answers.reduce((sum, a) => sum + a.score, 0) / session.totalQuestions);
      if (session.totalScore >= 80) session.overallFeedback = 'Performance excelente! Você está preparado para entrevistas reais.';
      else if (session.totalScore >= 60) session.overallFeedback = 'Bom desempenho! Ainda há alguns pontos para melhorar.';
      else session.overallFeedback = 'Continue praticando. Foque nos temas que tiveram menor pontuação.';
    }

    await session.save();
    return { score, feedback, session };
  }

  async getUserSessions(userId: string) {
    return this.sessionModel.find({ userId: new Types.ObjectId(userId) }).sort({ startedAt: -1 }).limit(20);
  }

  async getSessionById(userId: string, sessionId: string) {
    const session = await this.sessionModel.findOne({ _id: sessionId, userId: new Types.ObjectId(userId) });
    if (!session) throw new NotFoundException('Sessão não encontrada');
    const questionIds = session.answers.map(a => a.questionId);
    const questions = await this.questionModel.find({ _id: { $in: questionIds } });
    return { session, questions };
  }

  async getUserStats(userId: string) {
    const sessions = await this.sessionModel.find({ userId: new Types.ObjectId(userId), status: 'completed' });
    return {
      totalSessions: sessions.length,
      avgScore: sessions.length ? Math.round(sessions.reduce((s, ss) => s + ss.totalScore, 0) / sessions.length) : 0,
      bestScore: sessions.length ? Math.max(...sessions.map(s => s.totalScore)) : 0,
      totalQuestions: sessions.reduce((s, ss) => s + ss.totalQuestions, 0),
    };
  }
}
