import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Public()
  @Get()
  async findAll(@Query('difficulty') difficulty?: string) {
    return this.projectsService.findAll(difficulty);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-projects')
  async getMyProjects(@CurrentUser('_id') userId: string) {
    return this.projectsService.getMyProjects(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-stats')
  async getMyStats(@CurrentUser('_id') userId: string) {
    return this.projectsService.getUserStats(userId);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.projectsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  async startProject(@CurrentUser('_id') userId: string, @Param('id') id: string) {
    return this.projectsService.startProject(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/submit')
  async submitProject(
    @CurrentUser('_id') userId: string,
    @Param('id') id: string,
    @Body() body: { repoUrl: string; deployUrl?: string },
  ) {
    return this.projectsService.submitProject(userId, id, body.repoUrl, body.deployUrl);
  }
}
