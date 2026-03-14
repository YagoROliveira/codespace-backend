import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScheduleEventDocument = ScheduleEvent & Document;

@Schema({ timestamps: true })
export class ScheduleEvent {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  mentorId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    enum: ['study', 'session', 'challenge', 'project', 'review', 'meeting', 'deadline', 'other'],
    default: 'study',
  })
  type: string;

  @Prop({ required: true })
  scheduledDate: Date;

  @Prop({ default: '' })
  startTime: string; // HH:mm

  @Prop({ default: 60 })
  durationMinutes: number;

  @Prop({ enum: ['pending', 'completed', 'cancelled', 'skipped'], default: 'pending' })
  status: string;

  @Prop({ default: '' })
  link: string; // meeting URL, resource URL, etc.

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const ScheduleEventSchema = SchemaFactory.createForClass(ScheduleEvent);

ScheduleEventSchema.index({ userId: 1, scheduledDate: -1 });
ScheduleEventSchema.index({ mentorId: 1, scheduledDate: -1 });
ScheduleEventSchema.index({ status: 1, scheduledDate: 1 });
