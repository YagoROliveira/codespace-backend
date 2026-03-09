import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getConfig(): {
        publicKey: string;
    };
    createPaymentIntent(user: any, body: {
        planSlug: string;
        billingCycle?: 'monthly' | 'yearly';
    }): Promise<{
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
    getPaymentStatus(paymentIntentId: string): Promise<{
        status: import("stripe").Stripe.PaymentIntent.Status;
        amount: number;
        paymentMethod: string;
    }>;
    handleWebhook(signature: string, req: RawBodyRequest<Request>): Promise<{
        received: boolean;
    } | {
        error: string;
    }>;
}
