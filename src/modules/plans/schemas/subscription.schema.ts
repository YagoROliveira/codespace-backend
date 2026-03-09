import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ enum: ['active', 'cancelled', 'expired', 'past_due', 'pending'], default: 'pending' })
  status: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  cancelledAt: Date;

  @Prop({ enum: ['monthly', 'yearly'], default: 'monthly' })
  billingCycle: string;

  @Prop({ default: 0 })
  amountPaid: number;

  @Prop({ default: '' })
  paymentMethod: string;

  // Stripe fields
  @Prop({ default: '' })
  stripePaymentIntentId: string;

  @Prop({ default: '' })
  stripeCustomerId: string;

  @Prop({ default: '' })
  stripePaymentMethodType: string;

  @Prop({ default: '' })
  receiptUrl: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ stripePaymentIntentId: 1 });
