import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop({ default: '' })
  companyLogo: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: '' })
  requirements: string;

  @Prop({ default: '' })
  benefits: string;

  @Prop({ enum: ['remote', 'hybrid', 'onsite'], default: 'remote' })
  type: string;

  @Prop({ default: '' })
  location: string;

  @Prop({ enum: ['junior', 'pleno', 'senior', 'lead'], default: 'junior' })
  level: string;

  @Prop({ default: '' })
  salaryRange: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  requiredSkills: string[];

  @Prop({ default: '' })
  applicationUrl: string;

  @Prop({ default: '' })
  contactEmail: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isExclusive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  applicationsCount: number;

  @Prop()
  expiresAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ isActive: 1, isFeatured: -1, createdAt: -1 });
JobSchema.index({ isActive: 1, type: 1 });
JobSchema.index({ isActive: 1, level: 1 });
JobSchema.index({ expiresAt: 1 });

// ─── Job Applications ───
export type JobApplicationDocument = JobApplication & Document;

@Schema({ timestamps: true })
export class JobApplication {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ enum: ['applied', 'viewed', 'interview', 'hired', 'rejected'], default: 'applied' })
  status: string;

  @Prop({ default: '' })
  coverLetter: string;

  @Prop({ default: '' })
  resumeUrl: string;

  @Prop()
  appliedAt: Date;

  @Prop()
  updatedAt: Date;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);
JobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
