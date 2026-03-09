import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InterviewQuestionDocument = InterviewQuestion & Document;

@Schema({ timestamps: true })
export class InterviewQuestion {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  question: string;

  @Prop({ default: '' })
  hints: string;

  @Prop({ default: '' })
  idealAnswer: string;

  @Prop({ enum: ['behavioral', 'technical', 'coding', 'system-design'], default: 'technical' })
  type: string;

  @Prop({ enum: ['junior', 'pleno', 'senior', 'lead'], default: 'junior' })
  level: string;

  @Prop({ default: '' })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  company: string;

  @Prop({ default: 5 })
  timeLimitMinutes: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const InterviewQuestionSchema = SchemaFactory.createForClass(InterviewQuestion);

// ─── Interview Session ───
export type InterviewSessionDocument = InterviewSession & Document;

@Schema({ timestamps: true })
export class InterviewAnswer {
  @Prop({ type: Types.ObjectId, required: true })
  questionId: Types.ObjectId;

  @Prop({ default: '' })
  answer: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: '' })
  feedback: string;

  @Prop({ default: 0 })
  timeSpentSeconds: number;
}
export const InterviewAnswerSchema = SchemaFactory.createForClass(InterviewAnswer);

@Schema({ timestamps: true })
export class InterviewSession {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ enum: ['behavioral', 'technical', 'coding', 'system-design', 'mixed'], default: 'mixed' })
  type: string;

  @Prop({ enum: ['junior', 'pleno', 'senior', 'lead'], default: 'junior' })
  level: string;

  @Prop({ enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' })
  status: string;

  @Prop({ type: [InterviewAnswerSchema], default: [] })
  answers: InterviewAnswer[];

  @Prop({ default: 0 })
  totalScore: number;

  @Prop({ default: 0 })
  totalQuestions: number;

  @Prop({ default: 0 })
  answeredQuestions: number;

  @Prop({ default: '' })
  overallFeedback: string;

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;
}

export const InterviewSessionSchema = SchemaFactory.createForClass(InterviewSession);
InterviewSessionSchema.index({ userId: 1 });
