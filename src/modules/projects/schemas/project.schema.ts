import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: '' })
  longDescription: string;

  @Prop({ enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' })
  difficulty: string;

  @Prop({ default: '' })
  category: string;

  @Prop({ type: [String], default: [] })
  technologies: string[];

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: '' })
  repoUrl: string;

  @Prop({ default: '' })
  demoUrl: string;

  @Prop({ default: '' })
  thumbnailUrl: string;

  @Prop({ default: 0 })
  estimatedHours: number;

  @Prop({ default: 0 })
  participants: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ type: [String], default: [] })
  learningGoals: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ isActive: 1, isFeatured: -1 });
ProjectSchema.index({ isActive: 1, difficulty: 1 });
ProjectSchema.index({ isActive: 1, category: 1 });

// ─── User Project Progress ───
export type UserProjectDocument = UserProject & Document;

@Schema({ timestamps: true })
export class UserProject {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ enum: ['not_started', 'in_progress', 'submitted', 'reviewed', 'completed'], default: 'not_started' })
  status: string;

  @Prop({ default: '' })
  repoUrl: string;

  @Prop({ default: '' })
  deployUrl: string;

  @Prop({ default: '' })
  mentorFeedback: string;

  @Prop({ default: 0 })
  score: number;

  @Prop()
  startedAt: Date;

  @Prop()
  submittedAt: Date;

  @Prop()
  reviewedAt: Date;
}

export const UserProjectSchema = SchemaFactory.createForClass(UserProject);
UserProjectSchema.index({ userId: 1, projectId: 1 }, { unique: true });
