import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class AdminNote {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  authorId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: () => new Date() })
  createdAt: Date;
}

export const AdminNoteSchema = SchemaFactory.createForClass(AdminNote);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: '' })
  avatar: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  bio: string;

  @Prop({ default: '' })
  github: string;

  @Prop({ default: '' })
  linkedin: string;

  @Prop({ enum: ['essencial', 'profissional', 'elite', 'free'], default: 'free' })
  plan: string;

  @Prop({ enum: ['active', 'inactive', 'suspended', 'pending'], default: 'active' })
  status: string;

  @Prop({ enum: ['active', 'inactive', 'payment_pending', 'expired'], default: 'inactive' })
  accountStatus: string;

  @Prop()
  subscriptionEndDate: Date;

  @Prop({ enum: ['user', 'admin', 'mentor'], default: 'user' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  mentorId: Types.ObjectId;

  @Prop({ default: 0 })
  streakDays: number;

  @Prop({ default: 0 })
  totalHours: number;

  @Prop({ type: Object, default: {} })
  notificationPreferences: {
    email: boolean;
    push: boolean;
    mentorReminders: boolean;
    communityUpdates: boolean;
    weeklyReport: boolean;
  };

  @Prop()
  lastLoginAt: Date;

  @Prop({ type: [AdminNoteSchema], default: [] })
  adminNotes: AdminNote[];
}

export const UserSchema = SchemaFactory.createForClass(User);
