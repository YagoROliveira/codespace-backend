import { Model } from 'mongoose';
import { PlanDocument } from './schemas/plan.schema';
import { SubscriptionDocument } from './schemas/subscription.schema';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PlansService {
    private planModel;
    private subscriptionModel;
    private readonly usersService;
    private readonly notificationsService;
    constructor(planModel: Model<PlanDocument>, subscriptionModel: Model<SubscriptionDocument>, usersService: UsersService, notificationsService: NotificationsService);
    getPlans(): Promise<any[]>;
    getPlanBySlug(slug: string): Promise<any>;
    getUserSubscription(userId: string): Promise<any>;
    getInvoices(userId: string): Promise<any[]>;
    subscribe(userId: string, planSlug: string, billingCycle?: 'monthly' | 'yearly'): Promise<SubscriptionDocument>;
    cancelSubscription(userId: string): Promise<void>;
}
