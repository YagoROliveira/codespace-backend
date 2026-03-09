import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @Public()
  @Get()
  async findAll() {
    return this.challengesService.findAll();
  }

  @Public()
  @Get('weekly')
  async getWeekly() {
    return this.challengesService.findWeekly();
  }

  @Public()
  @Get('leaderboard')
  async getLeaderboard() {
    return this.challengesService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-stats')
  async getMyStats(@CurrentUser('_id') userId: string) {
    return this.challengesService.getUserStats(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-submissions')
  async getMySubmissions(@CurrentUser('_id') userId: string) {
    return this.challengesService.getUserSubmissions(userId);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.challengesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/submissions')
  async getChallengeSubmissions(@CurrentUser('_id') userId: string, @Param('id') id: string) {
    return this.challengesService.getUserSubmissions(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  async submit(
    @CurrentUser('_id') userId: string,
    @Param('id') id: string,
    @Body() body: { code: string; language: string },
  ) {
    return this.challengesService.submit(userId, id, body.code, body.language);
  }
}
