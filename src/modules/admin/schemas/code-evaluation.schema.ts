import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CodeEvaluationDocument = CodeEvaluation & Document;

@Schema()
export class EvaluationCriterion {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0, max: 10 })
  score: number;

  @Prop({ default: '' })
  comment: string;
}

export const EvaluationCriterionSchema = SchemaFactory.createForClass(EvaluationCriterion);

@Schema({ timestamps: true })
export class CodeEvaluation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Track' })
  trackId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  language: string;

  @Prop({ default: '' })
  codeSnippet: string;

  @Prop({ default: '' })
  repositoryUrl: string;

  @Prop({ type: [EvaluationCriterionSchema], default: [] })
  criteria: EvaluationCriterion[];

  @Prop({ default: 0, min: 0, max: 10 })
  overallScore: number;

  @Prop({ enum: ['pending', 'in_review', 'completed', 'revision_requested'], default: 'pending' })
  status: string;

  @Prop({ default: '' })
  feedback: string;

  @Prop({ default: '' })
  strengths: string;

  @Prop({ default: '' })
  improvements: string;

  @Prop()
  evaluatedAt: Date;
}

export const CodeEvaluationSchema = SchemaFactory.createForClass(CodeEvaluation);

CodeEvaluationSchema.index({ studentId: 1, createdAt: -1 });
CodeEvaluationSchema.index({ reviewerId: 1 });
CodeEvaluationSchema.index({ status: 1 });
CodeEvaluationSchema.index({ trackId: 1 });
