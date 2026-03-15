import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LabExerciseDocument = LabExercise & Document;

@Schema({ timestamps: true })
export class LabExercise {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string; // Markdown description

  @Prop({ required: true, enum: ['docker', 'kubernetes', 'cicd', 'monitoring', 'fullstack'] })
  labType: string;

  @Prop({
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  })
  difficulty: string;

  @Prop({ default: 0 })
  order: number; // Display order within labType

  @Prop({ default: 30 })
  estimatedMinutes: number;

  @Prop({ type: [String], default: [] })
  objectives: string[]; // Learning objectives

  @Prop({ default: '' })
  instructions: string; // Step-by-step markdown instructions

  @Prop({ default: '' })
  validationScript: string; // Bash script to validate exercise completion

  @Prop({ default: '' })
  hints: string; // Markdown hints (hidden by default)

  @Prop({ default: '' })
  solution: string; // Markdown solution (locked until attempt)

  @Prop({ type: [String], default: [] })
  tags: string[]; // e.g. ['dockerfile', 'multi-stage', 'networking']

  @Prop({ default: true })
  isActive: boolean;
}

export const LabExerciseSchema = SchemaFactory.createForClass(LabExercise);

LabExerciseSchema.index({ labType: 1, order: 1 });
LabExerciseSchema.index({ isActive: 1 });
