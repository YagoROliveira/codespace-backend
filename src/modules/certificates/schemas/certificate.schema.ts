import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({ timestamps: true })
export class Certificate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Track', required: true })
  trackId: Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  studentName: string;

  @Prop({ default: '' })
  trackTitle: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: 0 })
  totalHours: number;

  @Prop({ default: 0 })
  totalLessons: number;

  @Prop({ enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' })
  difficulty: string;

  @Prop()
  issuedAt: Date;

  @Prop()
  completedAt: Date;

  @Prop({ default: true })
  isValid: boolean;

  @Prop({ default: '' })
  verificationUrl: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);
CertificateSchema.index({ userId: 1, trackId: 1 }, { unique: true });
CertificateSchema.index({ code: 1 }, { unique: true });
