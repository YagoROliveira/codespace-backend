import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  priceMonthly: number;

  @Prop({ default: 0 })
  priceYearly: number;

  @Prop({ default: 0 })
  sessionsPerWeek: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: false })
  isPopular: boolean;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  // Stripe Price IDs
  @Prop({ default: '' })
  stripePriceMonthlyId: string;

  @Prop({ default: '' })
  stripePriceYearlyId: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
