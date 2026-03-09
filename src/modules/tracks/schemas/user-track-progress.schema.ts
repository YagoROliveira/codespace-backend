import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserTrackProgressDocument = UserTrackProgress & Document;

@Schema({ timestamps: true })
export class LessonProgress {
  @Prop({ type: Types.ObjectId, required: true })
  lessonId: Types.ObjectId;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt: Date;
}

export const LessonProgressSchema = SchemaFactory.createForClass(LessonProgress);

@Schema({ timestamps: true })
export class UserTrackProgress {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Track', required: true })
  trackId: Types.ObjectId;

  @Prop({ enum: ['not_started', 'in_progress', 'completed'], default: 'not_started' })
  status: string;

  @Prop({ default: 0 })
  progressPercent: number;

  @Prop({ default: 0 })
  completedLessons: number;

  @Prop({ type: [LessonProgressSchema], default: [] })
  lessonProgress: LessonProgress[];

  @Prop()
  startedAt: Date;

  @Prop()
  completedAt: Date;
}

export const UserTrackProgressSchema = SchemaFactory.createForClass(UserTrackProgress);

UserTrackProgressSchema.index({ userId: 1, trackId: 1 }, { unique: true });
