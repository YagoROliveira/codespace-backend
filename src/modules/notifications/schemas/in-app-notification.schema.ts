import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InAppNotificationDocument = InAppNotification & Document;

@Schema({ timestamps: true })
export class InAppNotification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  message: string;

  @Prop({
    enum: [
      'access_granted',
      'access_revoked',
      'session_scheduled',
      'session_cancelled',
      'session_reminder',
      'schedule_activity',
      'job_update',
      'payment',
      'system',
      'mentor',
      'community',
    ],
    default: 'system',
  })
  type: string;

  @Prop({ default: '' })
  link: string; // Frontend route to navigate to

  @Prop({ default: false })
  read: boolean;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>; // Extra data (e.g. sessionId, jobId)
}

export const InAppNotificationSchema = SchemaFactory.createForClass(InAppNotification);

InAppNotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
InAppNotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 3600 }); // TTL: 90 days
