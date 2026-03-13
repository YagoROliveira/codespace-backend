import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type IdeContainerDocument = IdeContainer & Document;

@Schema({ timestamps: true })
export class IdeContainer {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  serviceId: string; // Docker Swarm service ID

  @Prop({ required: true })
  serviceName: string; // e.g. "ide-45ebeb26"

  @Prop({ default: '' })
  containerId: string; // Docker container ID (from task, for reference)

  @Prop({ required: true })
  containerName: string; // Same as serviceName for display

  @Prop({ default: '' })
  url: string; // e.g. "https://ide-45ebeb26.ide.codespace.com.br"

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
