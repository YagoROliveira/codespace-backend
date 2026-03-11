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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stripe_1 = __importDefault(require("stripe"));
const plan_schema_1 = require("../plans/schemas/plan.schema");
const subscription_schema_1 = require("../plans/schemas/subscription.schema");
const users_service_1 = require("../users/users.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    constructor(configService, planModel, subscriptionModel, usersService, notificationsService) {
        this.configService = configService;
        this.planModel = planModel;
        this.subscriptionModel = subscriptionModel;
        this.usersService = usersService;
        this.notificationsService = notificationsService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY') || '', {
            apiVersion: '2026-02-25.clover',
        });
    }
    getPublicKey() {
        return this.configService.get('STRIPE_PUBLIC_KEY') || '';
    }
    async getOrCreateStripeCustomer(userId, email, name) {
        let customerId = await this.usersService.getStripeCustomerId(userId);
        if (customerId) {
            if (email || name) {
                await this.stripe.customers.update(customerId, {
                    ...(email && { email }),
                    ...(name && { name }),
                });
            }
            return customerId;
        }
        const existingSub = await this.subscriptionModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            stripeCustomerId: { $ne: '' },
        }).sort({ createdAt: -1 });
        if (existingSub?.stripeCustomerId) {
            customerId = existingSub.stripeCustomerId;
            if (email || name) {
                await this.stripe.customers.update(customerId, {
                    ...(email && { email }),
                    ...(name && { name }),
                });
            }
            await this.usersService.setStripeCustomerId(userId, customerId);
            return customerId;
        }
        const user = await this.usersService.findById(userId);
        const customer = await this.stripe.customers.create({
            email: email || user.email,
            name: name || user.name,
            metadata: { userId: userId.toString() },
        });
        await this.usersService.setStripeCustomerId(userId, customer.id);
        return customer.id;
    }
    async listPaymentMethods(userId) {
        const customerId = await this.getOrCreateStripeCustomer(userId);
        const methods = await this.stripe.customers.listPaymentMethods(customerId, { type: 'card' });
        const customer = await this.stripe.customers.retrieve(customerId);
        const defaultPmId = typeof customer.invoice_settings?.default_payment_method === 'string'
            ? customer.invoice_settings.default_payment_method
            : customer.invoice_settings?.default_payment_method?.id || null;
        return methods.data.map((pm) => ({
            id: pm.id,
            brand: pm.card?.brand || 'unknown',
            last4: pm.card?.last4 || '****',
            expMonth: pm.card?.exp_month || 0,
            expYear: pm.card?.exp_year || 0,
            isDefault: pm.id === defaultPmId,
        }));
    }
    async createSetupIntent(userId) {
        const customerId = await this.getOrCreateStripeCustomer(userId);
        const setupIntent = await this.stripe.setupIntents.create({
            customer: customerId,
            payment_method_types: ['card'],
        });
        return {
            clientSecret: setupIntent.client_secret,
        };
    }
    async setDefaultPaymentMethod(userId, paymentMethodId) {
        const customerId = await this.getOrCreateStripeCustomer(userId);
        const pm = await this.stripe.paymentMethods.retrieve(paymentMethodId);
        if (pm.customer !== customerId) {
            throw new common_1.BadRequestException('Método de pagamento não pertence a este cliente');
        }
        await this.stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });
        return { success: true };
    }
    async removePaymentMethod(userId, paymentMethodId) {
        const customerId = await this.getOrCreateStripeCustomer(userId);
        const pm = await this.stripe.paymentMethods.retrieve(paymentMethodId);
        if (pm.customer !== customerId) {
            throw new common_1.BadRequestException('Método de pagamento não pertence a este cliente');
        }
        await this.stripe.paymentMethods.detach(paymentMethodId);
        return { success: true };
    }
    async createPaymentIntent(userId, planSlug, billingCycle = 'monthly', customerEmail, customerName) {
        const plan = await this.planModel.findOne({ slug: planSlug, isActive: true });
        if (!plan)
            throw new common_1.NotFoundException('Plano não encontrado');
        const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
        if (!amount || amount <= 0)
            throw new common_1.BadRequestException('Preço inválido para este plano');
        const amountInCents = Math.round(amount * 100);
        const customerId = await this.getOrCreateStripeCustomer(userId, customerEmail, customerName);
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
        const plan = await this.planModel.findById(sub.planId).exec();
        const planSlug = plan?.slug || 'essencial';
        await this.usersService.activateAccount(sub.userId.toString(), planSlug, sub.endDate);
        const user = await this.usersService.findById(sub.userId.toString());
        await this.notificationsService.notifyAccountActivated({
            studentName: user.name,
            studentEmail: user.email,
            planName: plan?.name || planSlug,
        });
        await this.notificationsService.notifyNewSubscription({
            studentName: user.name,
            studentEmail: user.email,
            planName: plan?.name || planSlug,
            billingCycle: sub.billingCycle,
            amount: sub.amountPaid,
        });
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
        const plan = await this.planModel.findById(sub.planId).exec();
        const planSlug = plan?.slug || 'essencial';
        await this.usersService.activateAccount(sub.userId.toString(), planSlug, sub.endDate);
        try {
            const user = await this.usersService.findById(sub.userId.toString());
            await this.notificationsService.notifyAccountActivated({
                studentName: user.name,
                studentEmail: user.email,
                planName: plan?.name || planSlug,
            });
            await this.notificationsService.notifyNewSubscription({
                studentName: user.name,
                studentEmail: user.email,
                planName: plan?.name || planSlug,
                billingCycle: sub.billingCycle,
                amount: sub.amountPaid,
            });
        }
        catch { }
    }
    async handlePaymentFailed(paymentIntentId) {
        const sub = await this.subscriptionModel.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!sub)
            return;
        sub.status = 'past_due';
        await sub.save();
        await this.usersService.deactivateAccount(sub.userId.toString(), 'payment_pending');
        try {
            const user = await this.usersService.findById(sub.userId.toString());
            const plan = await this.planModel.findById(sub.planId).exec();
            await this.notificationsService.notifyPaymentFailed({
                studentName: user.name,
                studentEmail: user.email,
                planName: plan?.name || 'Desconhecido',
            });
        }
        catch { }
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
        mongoose_2.Model,
        users_service_1.UsersService,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map