import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentScheduleDocument = StudentSchedule & Document;

@Schema({ _id: false })
export class ScheduleItem {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true, min: 0, max: 6 })
  dayOfWeek: number;

  @Prop({ required: true })
  startTime: string; // HH:mm

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    enum: ['study', 'session', 'challenge', 'project', 'review', 'meeting', 'rest', 'other'],
    default: 'study',
  })
  type: string;

  @Prop({ default: 60 })
  durationMinutes: number;
}

export const ScheduleItemSchema = SchemaFactory.createForClass(ScheduleItem);

@Schema({ timestamps: true })
export class StudentSchedule {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  mentorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ScheduleTemplate' })
  templateId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: false })
  isCustom: boolean; // true = mentor criou manualmente, false = baseado em template

  @Prop({ type: [ScheduleItemSchema], default: [] })
  items: ScheduleItem[];

  @Prop({ default: true })
  isActive: boolean;
}

export const StudentScheduleSchema = SchemaFactory.createForClass(StudentSchedule);

StudentScheduleSchema.index({ userId: 1, isActive: 1 });
StudentScheduleSchema.index({ mentorId: 1 });
