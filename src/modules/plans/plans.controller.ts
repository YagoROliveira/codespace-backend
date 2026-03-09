import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Public()
  @Get()
  async getPlans() {
    return this.plansService.getPlans();
  }

  @Public()
  @Get(':slug')
  async getPlanBySlug(@Param('slug') slug: string) {
    return this.plansService.getPlanBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/subscription')
  async getUserSubscription(@CurrentUser('_id') userId: string) {
    return this.plansService.getUserSubscription(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/invoices')
  async getInvoices(@CurrentUser('_id') userId: string) {
    return this.plansService.getInvoices(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe/:planSlug')
  async subscribe(
    @CurrentUser('_id') userId: string,
    @Param('planSlug') planSlug: string,
    @Body('billingCycle') billingCycle?: 'monthly' | 'yearly',
  ) {
    return this.plansService.subscribe(userId, planSlug, billingCycle);
  }

  @UseGuards(JwtAuthGuard)
  @Put('cancel')
  async cancelSubscription(@CurrentUser('_id') userId: string) {
    await this.plansService.cancelSubscription(userId);
    return { message: 'Assinatura cancelada com sucesso' };
  }
}
