import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { PlanDocument } from '../plans/schemas/plan.schema';
import { SubscriptionDocument } from '../plans/schemas/subscription.schema';
export declare class PaymentsService {
    private configService;
    private planModel;
    private subscriptionModel;
    private stripe;
    constructor(configService: ConfigService, planModel: Model<PlanDocument>, subscriptionModel: Model<SubscriptionDocument>);
    getPublicKey(): string;
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
