import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Public()
  @Get()
  async findAll(@Query('type') type?: string, @Query('level') level?: string, @Query('tag') tag?: string) {
    return this.jobsService.findAll({ type, level, tag });
  }

  @Public()
  @Get('stats')
  async getStats() {
    return this.jobsService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-applications')
  async getMyApplications(@CurrentUser('_id') userId: string) {
    return this.jobsService.getMyApplications(userId);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/apply')
  async apply(@CurrentUser('_id') userId: string, @Param('id') id: string, @Body() body: { coverLetter?: string }) {
    return this.jobsService.apply(userId, id, body.coverLetter);
  }
}
