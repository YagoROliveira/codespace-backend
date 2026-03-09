import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChallengeDocument = Challenge & Document;

@Schema({ timestamps: true })
export class TestCase {
  @Prop({ required: true })
  input: string;

  @Prop({ required: true })
  expectedOutput: string;

  @Prop({ default: false })
  isHidden: boolean;
}
export const TestCaseSchema = SchemaFactory.createForClass(TestCase);

@Schema({ timestamps: true })
export class Challenge {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: '' })
  instructions: string;

  @Prop({ enum: ['easy', 'medium', 'hard', 'expert'], default: 'easy' })
  difficulty: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  category: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({ default: '' })
  starterCode: string;

  @Prop({ default: '' })
  solutionCode: string;

  @Prop({ type: [TestCaseSchema], default: [] })
  testCases: TestCase[];

  @Prop({ default: 0 })
  timeLimit: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  weekStart: Date;

  @Prop()
  weekEnd: Date;

  @Prop({ default: false })
  isWeekly: boolean;

  @Prop({ default: 0 })
  totalSubmissions: number;

  @Prop({ default: 0 })
  totalCompletions: number;
}

export const ChallengeSchema = SchemaFactory.createForClass(Challenge);

// ─── Submissions ───
export type ChallengeSubmissionDocument = ChallengeSubmission & Document;

@Schema({ timestamps: true })
export class ChallengeSubmission {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Challenge', required: true })
  challengeId: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ default: 'javascript' })
  language: string;

  @Prop({ enum: ['pending', 'passed', 'failed', 'error'], default: 'pending' })
  status: string;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: 0 })
  testsTotal: number;

  @Prop({ default: 0 })
  testsPassed: number;

  @Prop({ default: 0 })
  executionTimeMs: number;

  @Prop({ default: '' })
  feedback: string;

  @Prop()
  submittedAt: Date;
}

export const ChallengeSubmissionSchema = SchemaFactory.createForClass(ChallengeSubmission);
ChallengeSubmissionSchema.index({ userId: 1, challengeId: 1 });
