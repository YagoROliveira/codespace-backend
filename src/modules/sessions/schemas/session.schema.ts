import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

// Sub-schema for prontuário entries
export class ProntuarioEntry {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;

  @Prop({ default: '' })
  subjective: string; // Relato do aluno

  @Prop({ default: '' })
  objective: string; // Observação do mentor

  @Prop({ default: '' })
  assessment: string; // Avaliação

  @Prop({ default: '' })
  plan: string; // Plano de ação

  @Prop({ default: '' })
  notes: string; // Notas adicionais

  @Prop({ type: String })
  authorId: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  mentorId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true })
  scheduledAt: Date;

  @Prop({ default: 60 })
  durationMinutes: number;

  @Prop({ enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'], default: 'scheduled' })
  status: string;

  @Prop({ default: '' })
  meetingUrl: string;

  @Prop({ default: '' })
  recordingUrl: string;

  @Prop({ default: '' })
  notes: string;

  @Prop({ type: [String], default: [] })
  topics: string[];

  @Prop({ enum: ['mentoring', 'code_review', 'mock_interview', 'pair_programming'], default: 'mentoring' })
  type: string;

  // No-show tracking
  @Prop({ default: false })
  studentNoShow: boolean;

  @Prop({ type: Date })
  noShowMarkedAt: Date;

  // Prontuário (case record)
  @Prop({
    type: [{
      _id: { type: Types.ObjectId, default: () => new Types.ObjectId() },
      subjective: { type: String, default: '' },
      objective: { type: String, default: '' },
      assessment: { type: String, default: '' },
      plan: { type: String, default: '' },
      notes: { type: String, default: '' },
      authorId: { type: String },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }],
    default: [],
  })
  prontuario: ProntuarioEntry[];

  // Notification tracking
  @Prop({ type: Date })
  lastNotifiedAt: Date;

  @Prop({ default: 0 })
  notificationCount: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.index({ userId: 1, scheduledAt: -1 });
SessionSchema.index({ mentorId: 1, scheduledAt: -1 });
SessionSchema.index({ status: 1, scheduledAt: -1 });
