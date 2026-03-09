"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stripe_1 = require("stripe");
const plan_schema_1 = require("../plans/schemas/plan.schema");
const subscription_schema_1 = require("../plans/schemas/subscription.schema");
let PaymentsService = class PaymentsService {
    constructor(configService, planModel, subscriptionModel) {
        this.configService = configService;
        this.planModel = planModel;
        this.subscriptionModel = subscriptionModel;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2026-02-25.clover',
        });
    }
    getPublicKey() {
        return this.configService.get('STRIPE_PUBLIC_KEY') || '';
    }
    async createPaymentIntent(userId, planSlug, billingCycle = 'monthly', customerEmail, customerName) {
        const plan = await this.planModel.findOne({ slug: planSlug, isActive: true });
        if (!plan)
            throw new common_1.NotFoundException('Plano não encontrado');
        const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
        if (!amount || amount <= 0)
            throw new common_1.BadRequestException('Preço inválido para este plano');
        const amountInCents = Math.round(amount * 100);
        let customerId;
        const existingSub = await this.subscriptionModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            stripeCustomerId: { $ne: '' },
        }).sort({ createdAt: -1 });
        if (existingSub?.stripeCustomerId) {
            customerId = existingSub.stripeCustomerId;
            await this.stripe.customers.update(customerId, {
                email: customerEmail,
                name: customerName,
            });
        }
        else {
            const customer = await this.stripe.customers.create({
                email: customerEmail,
                name: customerName,
                metadata: { userId: userId.toString() },
            });
            customerId = customer.id;
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'brl',
            customer: customerId,
            payment_method_types: ['card'],
            metadata: {
                userId: userId.toString(),
                planSlug,
                planName: plan.name,
                billingCycle,
                planId: plan._id.toString(),
            },
            description: `Codespace - Plano ${plan.name} (${billingCycle === 'yearly' ? 'Anual' : 'Mensal'})`,
        });
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));
        await this.subscriptionModel.updateMany({ userId: new mongoose_2.Types.ObjectId(userId), status: 'active' }, { status: 'cancelled', cancelledAt: new Date() });
        await this.subscriptionModel.create({
            userId: new mongoose_2.Types.ObjectId(userId),
            planId: plan._id,
            status: 'pending',
            startDate: new Date(),
            endDate,
            billingCycle,
            amountPaid: amount,
            paymentMethod: 'stripe',
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId: customerId,
        });
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount,
            amountInCents,
            plan: {
                name: plan.name,
                slug: plan.slug,
                description: plan.description,
            },
        };
    }
    async confirmPayment(paymentIntentId) {
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            return { status: paymentIntent.status, activated: false };
        }
        const sub = await this.subscriptionModel.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!sub)
            throw new common_1.NotFoundException('Assinatura não encontrada');
        if (sub.status === 'active') {
            return { status: 'succeeded', activated: true, alreadyActive: true };
        }
        sub.status = 'active';
        sub.stripePaymentMethodType = paymentIntent.payment_method_types?.[0] || 'card';
        if (paymentIntent.latest_charge) {
            try {
                const charge = await this.stripe.charges.retrieve(paymentIntent.latest_charge);
                sub.receiptUrl = charge.receipt_url || '';
            }
            catch { }
        }
        await sub.save();
        return { status: 'succeeded', activated: true };
    }
    async handleWebhook(signature, rawBody) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret || '');
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook signature verification failed: ${err.message}`);
        }
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const pi = event.data.object;
                await this.activateSubscription(pi.id);
                break;
            }
            case 'payment_intent.payment_failed': {
                const pi = event.data.object;
                await this.handlePaymentFailed(pi.id);
                break;
            }
        }
        return { received: true };
    }
    async activateSubscription(paymentIntentId) {
        const sub = await this.subscriptionModel.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!sub || sub.status === 'active')
            return;
        sub.status = 'active';
        await sub.save();
    }
    async handlePaymentFailed(paymentIntentId) {
        const sub = await this.subscriptionModel.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!sub)
            return;
        sub.status = 'past_due';
        await sub.save();
    }
    async getPaymentStatus(paymentIntentId) {
        const pi = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        return {
            status: pi.status,
            amount: pi.amount / 100,
            paymentMethod: pi.payment_method_types?.[0],
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __param(2, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map