import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    getPlans(): Promise<import("./schemas/plan.schema").PlanDocument[]>;
    getPlanBySlug(slug: string): Promise<import("./schemas/plan.schema").PlanDocument>;
    getUserSubscription(userId: string): Promise<any>;
    getInvoices(userId: string): Promise<import("./schemas/subscription.schema").SubscriptionDocument[]>;
    subscribe(userId: string, planSlug: string, billingCycle?: 'monthly' | 'yearly'): Promise<import("./schemas/subscription.schema").SubscriptionDocument>;
    cancelSubscription(userId: string): Promise<{
        message: string;
    }>;
}
