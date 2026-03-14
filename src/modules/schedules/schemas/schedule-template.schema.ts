import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScheduleTemplateDocument = ScheduleTemplate & Document;

@Schema({ _id: false })
export class TemplateItem {
  @Prop({ required: true, min: 0, max: 6 })
  dayOfWeek: number; // 0=Domingo, 1=Segunda ... 6=Sábado

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

export const TemplateItemSchema = SchemaFactory.createForClass(TemplateItem);

@Schema({ timestamps: true })
export class ScheduleTemplate {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({
    required: true,
    enum: ['essencial', 'profissional', 'elite'],
  })
  planSlug: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ type: [TemplateItemSchema], default: [] })
  items: TemplateItem[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ScheduleTemplateSchema = SchemaFactory.createForClass(ScheduleTemplate);

ScheduleTemplateSchema.index({ planSlug: 1, isDefault: 1 });
ScheduleTemplateSchema.index({ isActive: 1 });
