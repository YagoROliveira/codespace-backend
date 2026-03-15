import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LabEnvironmentDocument = LabEnvironment & Document;

@Schema({ timestamps: true })
export class LabEnvironment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  serviceId: string; // Docker Swarm service ID

  @Prop({ required: true })
  serviceName: string; // e.g. "lab-45ebeb26"

  @Prop({ required: true })
  labType: string; // 'docker' | 'kubernetes' | 'cicd' | 'monitoring' | 'fullstack'

  @Prop({ default: '' })
  url: string; // Web terminal URL (ttyd) — e.g. "https://lab-45ebeb26.lab.codespace.com.br"

  @Prop({ enum: ['creating', 'running', 'stopped', 'error'], default: 'creating' })
  status: string;

  @Prop({ default: null })
  lastAccessedAt: Date;

  @Prop({ default: null })
  stoppedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'LabExercise', default: null })
  currentExerciseId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'LabExercise' }], default: [] })
  completedExercises: Types.ObjectId[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>; // Extra info like k8s namespace, ports, etc.
}

export const LabEnvironmentSchema = SchemaFactory.createForClass(LabEnvironment);

// Compound index: one active env per user+type
LabEnvironmentSchema.index({ userId: 1, labType: 1 }, { unique: true });
