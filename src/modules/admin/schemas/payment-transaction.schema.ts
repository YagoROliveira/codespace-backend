import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentTransactionDocument = PaymentTransaction & Document;

@Schema({ timestamps: true })
export class PaymentTransaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Subscription' })
  subscriptionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan' })
  planId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'BRL' })
  currency: string;

  @Prop({ enum: ['succeeded', 'failed', 'pending', 'refunded', 'cancelled', 'processing'], default: 'pending' })
  status: string;

  @Prop({ enum: ['credit_card', 'pix', 'boleto', 'debit_card', 'wallet'], default: 'credit_card' })
  paymentMethod: string;

  @Prop({ default: '' })
  gatewayTransactionId: string;

  @Prop({ default: '' })
  gatewayProvider: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  failureReason: string;

  @Prop({ type: Number, default: 0 })
  attempt: number;

  @Prop({ type: Number, default: 0 })
  refundedAmount: number;

  @Prop()
  refundedAt: Date;

  @Prop({ default: '' })
  invoiceUrl: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, unknown>;

  @Prop()
  paidAt: Date;
}

export const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransaction);

PaymentTransactionSchema.index({ userId: 1, createdAt: -1 });
PaymentTransactionSchema.index({ subscriptionId: 1 });
PaymentTransactionSchema.index({ status: 1 });
