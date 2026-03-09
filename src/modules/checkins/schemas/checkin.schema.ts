import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckinDocument = Checkin & Document;

@Schema({ timestamps: true })
export class Checkin {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: string; // YYYY-MM-DD

  @Prop({ default: '' })
  studiedToday: string;

  @Prop({ default: '' })
  difficulties: string;

  @Prop({ default: '' })
  nextSteps: string;

  @Prop({ default: 0 })
  hoursStudied: number;

  @Prop({ enum: ['great', 'good', 'neutral', 'bad', 'terrible'], default: 'good' })
  mood: string;

  @Prop({ default: 0 })
  productivityScore: number;

  @Prop({ default: '' })
  mentorNote: string;
}

export const CheckinSchema = SchemaFactory.createForClass(Checkin);
CheckinSchema.index({ userId: 1, date: 1 }, { unique: true });
