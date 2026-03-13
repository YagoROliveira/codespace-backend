import { PlansService } from './plans.service';
export declare class PlansController {
    private readonly plansService;
    constructor(plansService: PlansService);
    getPlans(): Promise<any[]>;
    getPlanBySlug(slug: string): Promise<any>;
    getUserSubscription(userId: string): Promise<any>;
    getInvoices(userId: string): Promise<any[]>;
    subscribe(userId: string, planSlug: string, billingCycle?: 'monthly' | 'yearly'): Promise<import("./schemas/subscription.schema").SubscriptionDocument>;
    cancelSubscription(userId: string): Promise<{
        message: string;
    }>;
}
