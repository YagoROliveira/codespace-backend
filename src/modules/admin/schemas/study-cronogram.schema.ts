import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudyCronogramDocument = StudyCronogram & Document;

// ─── Track item within a cronogram ───
@Schema({ _id: false })
export class CronogramTrackItem {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Track', required: true })
  trackId: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: 0 })
  estimatedHours: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending',
  })
  status: string;

  @Prop({ default: 0 })
  progressPercent: number;

  @Prop({ default: 0 })
  completedLessons: number;

  @Prop({ default: 0 })
  totalLessons: number;

  @Prop()
  completedAt: Date;

  @Prop({ default: '' })
  notes: string;
}

export const CronogramTrackItemSchema = SchemaFactory.createForClass(CronogramTrackItem);

// ─── Daily study item ───
@Schema({ _id: false })
export class CronogramDailyItem {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Track', required: true })
  trackId: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  lessonId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ enum: ['lesson', 'review', 'practice', 'project', 'reading'], default: 'lesson' })
  type: string;

  @Prop({ default: 30 })
  estimatedMinutes: number;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt: Date;

  @Prop({ default: '' })
  notes: string;

  @Prop({ default: 0 })
  order: number;
}

export const CronogramDailyItemSchema = SchemaFactory.createForClass(CronogramDailyItem);

// ─── Milestone checkpoint ───
@Schema({ _id: false })
export class CronogramMilestone {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  targetDate: Date;

  @Prop({ enum: ['pending', 'completed', 'overdue'], default: 'pending' })
  status: string;

  @Prop()
  completedAt: Date;
}

export const CronogramMilestoneSchema = SchemaFactory.createForClass(CronogramMilestone);

// ─── Main Study Cronogram ───
@Schema({ timestamps: true })
export class StudyCronogram {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, min: 0.5, max: 16 })
  dailyStudyHours: number;

  @Prop({ type: [Number], default: [1, 2, 3, 4, 5] })
  weeklyStudyDays: number[]; // 0=Dom, 1=Seg ... 6=Sáb

  @Prop({ default: 0 })
  totalEstimatedHours: number;

  @Prop({ default: 0 })
  totalStudyDays: number;

  @Prop({ type: [CronogramTrackItemSchema], default: [] })
  tracks: CronogramTrackItem[];

  @Prop({ type: [CronogramMilestoneSchema], default: [] })
  milestones: CronogramMilestone[];

  @Prop({ type: [CronogramDailyItemSchema], default: [] })
  dailyPlan: CronogramDailyItem[];

  @Prop({
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'draft',
  })
  status: string;

  @Prop({ default: 0 })
  overallProgress: number; // 0-100

  @Prop()
  completedAt: Date;

  @Prop()
  pausedAt: Date;

  @Prop({ default: '' })
  pauseReason: string;

  // Snapshot of progress over time for chart
  @Prop({
    type: [{
      date: Date,
      progress: Number,
      tracksCompleted: Number,
    }],
    default: [],
  })
  progressHistory: Array<{
    date: Date;
    progress: number;
    tracksCompleted: number;
  }>;
}

export const StudyCronogramSchema = SchemaFactory.createForClass(StudyCronogram);

StudyCronogramSchema.index({ userId: 1, status: 1 });
StudyCronogramSchema.index({ createdBy: 1 });
