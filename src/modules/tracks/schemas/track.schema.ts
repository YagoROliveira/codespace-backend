import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  videoUrl: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ default: 0 })
  durationMinutes: number;

  @Prop({ default: 0 })
  order: number;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

@Schema()
export class TrackDocument_ {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  fileUrl: string;

  @Prop({ default: '' })
  fileType: string;

  @Prop({ default: 0 })
  fileSizeKb: number;

  @Prop({ default: () => new Date() })
  uploadedAt: Date;
}

export const TrackDocumentSchema = SchemaFactory.createForClass(TrackDocument_);

@Schema({ timestamps: true })
export class Track {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: '' })
  icon: string;

  @Prop({ default: '' })
  color: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' })
  difficulty: string;

  @Prop({ default: 0 })
  totalLessons: number;

  @Prop({ default: 0 })
  estimatedHours: number;

  @Prop({ type: [LessonSchema], default: [] })
  lessons: Lesson[];

  @Prop({ type: [String], enum: ['free', 'essencial', 'profissional', 'elite'], default: ['free'] })
  requiredPlans: string[];

  @Prop({ default: true })
  isPublished: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: [TrackDocumentSchema], default: [] })
  documents: TrackDocument_[];
}

export const TrackSchema = SchemaFactory.createForClass(Track);
