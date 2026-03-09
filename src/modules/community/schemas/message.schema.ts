import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Channel', required: true })
  channelId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likes: Types.ObjectId[];

  @Prop({ default: 0 })
  replyCount: number;

  @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
  parentMessageId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ channelId: 1, createdAt: -1 });
MessageSchema.index({ parentMessageId: 1 });
