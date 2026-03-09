import { Model } from 'mongoose';
import { PlanDocument } from './schemas/plan.schema';
import { SubscriptionDocument } from './schemas/subscription.schema';
export declare class PlansService {
    private planModel;
    private subscriptionModel;
    constructor(planModel: Model<PlanDocument>, subscriptionModel: Model<SubscriptionDocument>);
    getPlans(): Promise<PlanDocument[]>;
    getPlanBySlug(slug: string): Promise<PlanDocument>;
    getUserSubscription(userId: string): Promise<any>;
    getInvoices(userId: string): Promise<SubscriptionDocument[]>;
    subscribe(userId: string, planSlug: string, billingCycle?: 'monthly' | 'yearly'): Promise<SubscriptionDocument>;
    cancelSubscription(userId: string): Promise<void>;
}
