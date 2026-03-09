import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) { }

  @UseGuards(JwtAuthGuard)
  @Get('questions')
  async getQuestions(@Query('type') type?: string, @Query('level') level?: string) {
    return this.interviewsService.getQuestions(type, level);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-sessions')
  async getMySessions(@CurrentUser('_id') userId: string) {
    return this.interviewsService.getUserSessions(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-stats')
  async getMyStats(@CurrentUser('_id') userId: string) {
    return this.interviewsService.getUserStats(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions/:id')
  async getSession(@CurrentUser('_id') userId: string, @Param('id') id: string) {
    return this.interviewsService.getSessionById(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start')
  async startSession(
    @CurrentUser('_id') userId: string,
    @Body() body: { type: string; level: string; questionCount?: number },
  ) {
    return this.interviewsService.startSession(userId, body.type, body.level, body.questionCount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sessions/:id/answer')
  async submitAnswer(
    @CurrentUser('_id') userId: string,
    @Param('id') sessionId: string,
    @Body() body: { questionId: string; answer: string; timeSpent: number },
  ) {
    return this.interviewsService.submitAnswer(userId, sessionId, body.questionId, body.answer, body.timeSpent);
  }
}
