import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { PlanDocument } from '../plans/schemas/plan.schema';
import { SubscriptionDocument } from '../plans/schemas/subscription.schema';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PaymentsService {
    private configService;
    private planModel;
    private subscriptionModel;
    private usersService;
    private notificationsService;
    private stripe;
    constructor(configService: ConfigService, planModel: Model<PlanDocument>, subscriptionModel: Model<SubscriptionDocument>, usersService: UsersService, notificationsService: NotificationsService);
    getPublicKey(): string;
    getOrCreateStripeCustomer(userId: string, email?: string, name?: string): Promise<string>;
    listPaymentMethods(userId: string): Promise<{
        id: string;
        brand: string;
        last4: string;
        expMonth: number;
        expYear: number;
        isDefault: boolean;
    }[]>;
    createSetupIntent(userId: string): Promise<{
        clientSecret: string;
    }>;
    setDefaultPaymentMethod(userId: string, paymentMethodId: string): Promise<{
        success: boolean;
    }>;
    removePaymentMethod(userId: string, paymentMethodId: string): Promise<{
        success: boolean;
    }>;
    createPaymentIntent(userId: string, planSlug: string, billingCycle: 'monthly' | 'yearly', customerEmail: string, customerName: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
        amount: number;
        amountInCents: number;
        plan: {
            name: string;
            slug: string;
            description: string;
        };
    }>;
    confirmPayment(paymentIntentId: string): Promise<{
        status: string;
        activated: boolean;
        alreadyActive: boolean;
    } | {
        status: string;
        activated: boolean;
        alreadyActive?: undefined;
    }>;
    handleWebhook(signature: string, rawBody: Buffer): Promise<{
        received: boolean;
    }>;
    private activateSubscription;
    private handlePaymentFailed;
    getPaymentStatus(paymentIntentId: string): Promise<{
        status: Stripe.PaymentIntent.Status;
        amount: number;
        paymentMethod: string;
    }>;
}
