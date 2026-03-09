import { Controller, Post, Get, Body, Param, Headers, Req, UseGuards, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  /**
   * Get Stripe publishable key (public)
   */
  @Public()
  @Get('config')
  getConfig() {
    return { publicKey: this.paymentsService.getPublicKey() };
  }

  /**
   * Create a PaymentIntent for the checkout
   */
  @UseGuards(JwtAuthGuard)
  @Post('create-payment-intent')
  async createPaymentIntent(
    @CurrentUser() user: any,
    @Body() body: { planSlug: string; billingCycle?: 'monthly' | 'yearly' },
  ) {
    return this.paymentsService.createPaymentIntent(
      user._id,
      body.planSlug,
      body.billingCycle || 'monthly',
      user.email,
      user.name,
    );
  }

  /**
   * Confirm payment was successful (frontend calls after Stripe confirms)
   */
  @UseGuards(JwtAuthGuard)
  @Post('confirm/:paymentIntentId')
  async confirmPayment(@Param('paymentIntentId') paymentIntentId: string) {
    return this.paymentsService.confirmPayment(paymentIntentId);
  }

  /**
   * Get payment status
   */
  @UseGuards(JwtAuthGuard)
  @Get('status/:paymentIntentId')
  async getPaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    return this.paymentsService.getPaymentStatus(paymentIntentId);
  }

  /**
   * Stripe webhook handler (raw body needed for signature verification)
   */
  @Public()
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      return { error: 'No raw body' };
    }
    return this.paymentsService.handleWebhook(signature, rawBody);
  }
}
