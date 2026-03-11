import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IdeContainerDocument = IdeContainer & Document;

@Schema({ timestamps: true })
export class IdeContainer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  containerId: string; // Docker container ID

  @Prop({ required: true })
  containerName: string; // e.g. "ide-507f1f77bcf86cd799439011"

  @Prop({ default: '' })
  url: string; // e.g. "https://ide-507f1f77.codespace.dev.br"

  @Prop({ default: '' })
  password: string; // code-server password

  @Prop({ enum: ['creating', 'running', 'stopped', 'error'], default: 'creating' })
  status: string;

  @Prop({ default: null })
  lastAccessedAt: Date;

  @Prop({ default: null })
  stoppedAt: Date;
}

export const IdeContainerSchema = SchemaFactory.createForClass(IdeContainer);
