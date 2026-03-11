import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    private readonly usersService: UsersService,
  ) { }

  async getPlans(): Promise<PlanDocument[]> {
    return this.planModel.find({ isActive: true }).sort({ order: 1 }).exec();
  }

  async getPlanBySlug(slug: string): Promise<PlanDocument> {
    const plan = await this.planModel.findOne({ slug }).exec();
    if (!plan) throw new NotFoundException('Plano não encontrado');
    return plan;
  }

  async getUserSubscription(userId: string): Promise<any> {
    const subscription = await this.subscriptionModel
      .findOne({
        userId: new Types.ObjectId(userId),
        status: 'active',
      })
      .populate('planId')
      .sort({ createdAt: -1 })
      .exec();

    return subscription;
  }

  async getInvoices(userId: string): Promise<SubscriptionDocument[]> {
    return this.subscriptionModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('planId', 'name slug')
      .sort({ startDate: -1 })
      .exec();
  }

  async subscribe(
    userId: string,
    planSlug: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly',
  ): Promise<SubscriptionDocument> {
    const plan = await this.getPlanBySlug(planSlug);

    // Cancel existing active subscription
    await this.subscriptionModel.updateMany(
      { userId: new Types.ObjectId(userId), status: 'active' },
      { status: 'cancelled', cancelledAt: new Date() },
    );

    const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

    const subscription = new this.subscriptionModel({
      userId: new Types.ObjectId(userId),
      planId: plan._id,
      status: 'active',
      startDate: new Date(),
      endDate,
      billingCycle,
      amountPaid: amount,
    });

    return subscription.save();
  }

  async cancelSubscription(userId: string): Promise<void> {
    await this.subscriptionModel.updateMany(
      { userId: new Types.ObjectId(userId), status: 'active' },
      { status: 'cancelled', cancelledAt: new Date() },
    );
    // Deactivate the user account and revert to free plan
    await this.usersService.deactivateAccount(userId, 'inactive');
  }
}
