import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser('_id') userId: string,
    @Body() body: { studiedToday: string; difficulties: string; nextSteps: string; hoursStudied: number; mood: string; productivityScore: number },
  ) {
    return this.checkinsService.create(userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('today')
  async getToday(@CurrentUser('_id') userId: string) {
    return this.checkinsService.getToday(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getHistory(@CurrentUser('_id') userId: string, @Query('days') days?: string) {
    return this.checkinsService.getHistory(userId, days ? parseInt(days) : 30);
  }

  @UseGuards(JwtAuthGuard)
  @Get('weekly-report')
  async getWeeklyReport(@CurrentUser('_id') userId: string) {
    return this.checkinsService.getWeeklyReport(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('streak')
  async getStreak(@CurrentUser('_id') userId: string) {
    return { streak: await this.checkinsService.getStreak(userId) };
  }
}
