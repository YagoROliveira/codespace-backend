import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import Stripe from 'stripe';
import { Plan, PlanDocument } from '../plans/schemas/plan.schema';
import { Subscription, SubscriptionDocument } from '../plans/schemas/subscription.schema';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2026-02-25.clover',
    });
  }

  /**
   * Get Stripe publishable key for the frontend
   */
  getPublicKey(): string {
    return this.configService.get<string>('STRIPE_PUBLIC_KEY') || '';
  }

  /**
   * Get or create a Stripe customer for the user, persisting
   * the customer ID on the User document for future reuse.
   */
  async getOrCreateStripeCustomer(userId: string, email?: string, name?: string): Promise<string> {
    // 1) Check User document first
    let customerId = await this.usersService.getStripeCustomerId(userId);

    if (customerId) {
      // Optionally update Stripe customer info
      if (email || name) {
        await this.stripe.customers.update(customerId, {
          ...(email && { email }),
          ...(name && { name }),
        });
      }
      return customerId;
    }

    // 2) Fallback: check existing subscriptions (legacy)
    const existingSub = await this.subscriptionModel.findOne({
      userId: new Types.ObjectId(userId),
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
      // Persist on user for future lookups
      await this.usersService.setStripeCustomerId(userId, customerId);
      return customerId;
    }

    // 3) Create a brand-new Stripe customer
    const user = await this.usersService.findById(userId);
    const customer = await this.stripe.customers.create({
      email: email || user.email,
      name: name || user.name,
      metadata: { userId: userId.toString() },
    });
    await this.usersService.setStripeCustomerId(userId, customer.id);
    return customer.id;
  }

  // ─── Payment Method Management ───

  /**
   * List all payment methods (cards) for a user
   */
  async listPaymentMethods(userId: string) {
    const customerId = await this.getOrCreateStripeCustomer(userId);

    const methods = await this.stripe.customers.listPaymentMethods(customerId, { type: 'card' });

    // Get the default payment method from the customer
    const customer = await this.stripe.customers.retrieve(customerId) as Stripe.Customer;
    const defaultPmId =
      typeof customer.invoice_settings?.default_payment_method === 'string'
        ? customer.invoice_settings.default_payment_method
        : (customer.invoice_settings?.default_payment_method as Stripe.PaymentMethod)?.id || null;

    return methods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand || 'unknown',
      last4: pm.card?.last4 || '****',
      expMonth: pm.card?.exp_month || 0,
      expYear: pm.card?.exp_year || 0,
      isDefault: pm.id === defaultPmId,
    }));
  }

  /**
   * Create a SetupIntent so the frontend can collect a new card via Stripe Elements
   */
  async createSetupIntent(userId: string) {
    const customerId = await this.getOrCreateStripeCustomer(userId);

    const setupIntent = await this.stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return {
      clientSecret: setupIntent.client_secret,
    };
  }

  /**
   * Set a payment method as the customer's default
   */
  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    const customerId = await this.getOrCreateStripeCustomer(userId);

    // Ensure the payment method is attached to this customer
    const pm = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    if (pm.customer !== customerId) {
      throw new BadRequestException('Método de pagamento não pertence a este cliente');
    }

    await this.stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return { success: true };
  }

  /**
   * Remove (detach) a payment method from the customer
   */
  async removePaymentMethod(userId: string, paymentMethodId: string) {
    const customerId = await this.getOrCreateStripeCustomer(userId);

    // Verify ownership
    const pm = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    if (pm.customer !== customerId) {
      throw new BadRequestException('Método de pagamento não pertence a este cliente');
    }

    await this.stripe.paymentMethods.detach(paymentMethodId);

    return { success: true };
  }

  /**
   * Create a PaymentIntent for transparent checkout
   * Supports card, pix, and boleto payment methods
   */
  async createPaymentIntent(
    userId: string,
    planSlug: string,
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    customerEmail: string,
    customerName: string,
  ) {
    const plan = await this.planModel.findOne({ slug: planSlug, isActive: true });
    if (!plan) throw new NotFoundException('Plano não encontrado');

    const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    if (!amount || amount <= 0) throw new BadRequestException('Preço inválido para este plano');

    // Amount in centavos (Stripe uses smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Find or create Stripe customer (now uses consolidated helper)
    const customerId = await this.getOrCreateStripeCustomer(userId, customerEmail, customerName);

    // Create PaymentIntent with multiple payment method types
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

    // Create pending subscription record
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));

    // Cancel any existing active sub
    await this.subscriptionModel.updateMany(
      { userId: new Types.ObjectId(userId), status: 'active' },
      { status: 'cancelled', cancelledAt: new Date() },
    );

    await this.subscriptionModel.create({
      userId: new Types.ObjectId(userId),
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

  /**
   * Confirm payment and activate subscription (called after successful payment on frontend)
   */
  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return { status: paymentIntent.status, activated: false };
    }

    const sub = await this.subscriptionModel.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!sub) throw new NotFoundException('Assinatura não encontrada');

    if (sub.status === 'active') {
      return { status: 'succeeded', activated: true, alreadyActive: true };
    }

    sub.status = 'active';
    sub.stripePaymentMethodType = paymentIntent.payment_method_types?.[0] || 'card';

    // Get receipt URL from charge
    if (paymentIntent.latest_charge) {
      try {
        const charge = await this.stripe.charges.retrieve(paymentIntent.latest_charge as string);
        sub.receiptUrl = charge.receipt_url || '';
      } catch { }
    }

    await sub.save();

    // Activate user account and update plan
    const plan = await this.planModel.findById(sub.planId).exec();
    const planSlug = plan?.slug || 'essencial';
    await this.usersService.activateAccount(sub.userId.toString(), planSlug, sub.endDate);

    // Send notifications
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

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret || '');
    } catch (err: any) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await this.activateSubscription(pi.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent;
        await this.handlePaymentFailed(pi.id);
        break;
      }
    }

    return { received: true };
  }

  private async activateSubscription(paymentIntentId: string) {
    const sub = await this.subscriptionModel.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!sub || sub.status === 'active') return;

    sub.status = 'active';
    await sub.save();

    // Activate user account and update plan
    const plan = await this.planModel.findById(sub.planId).exec();
    const planSlug = plan?.slug || 'essencial';
    await this.usersService.activateAccount(sub.userId.toString(), planSlug, sub.endDate);

    // Send notifications
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
    } catch { }
  }

  private async handlePaymentFailed(paymentIntentId: string) {
    const sub = await this.subscriptionModel.findOne({ stripePaymentIntentId: paymentIntentId });
    if (!sub) return;

    sub.status = 'past_due';
    await sub.save();

    // Deactivate user account
    await this.usersService.deactivateAccount(sub.userId.toString(), 'payment_pending');

    // Send payment failed notification
    try {
      const user = await this.usersService.findById(sub.userId.toString());
      const plan = await this.planModel.findById(sub.planId).exec();
      await this.notificationsService.notifyPaymentFailed({
        studentName: user.name,
        studentEmail: user.email,
        planName: plan?.name || 'Desconhecido',
      });
    } catch { }
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(paymentIntentId: string) {
    const pi = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      status: pi.status,
      amount: pi.amount / 100,
      paymentMethod: pi.payment_method_types?.[0],
    };
  }
}
