import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) { }

  @Public()
  @Get()
  async findAll(
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
  ) {
    return this.resourcesService.findAll(type, category, tag);
  }

  @Public()
  @Get('categories')
  async getCategories() {
    return this.resourcesService.getCategories();
  }

  @Public()
  @Get('stats')
  async getStats() {
    return this.resourcesService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-bookmarks')
  async getMyBookmarks(@CurrentUser('_id') userId: string) {
    return this.resourcesService.getMyBookmarks(userId);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.resourcesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/download')
  async download(@Param('id') id: string) {
    return this.resourcesService.download(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async like(@CurrentUser('_id') userId: string, @Param('id') id: string) {
    return this.resourcesService.like(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/bookmark')
  async bookmark(@CurrentUser('_id') userId: string, @Param('id') id: string) {
    return this.resourcesService.bookmark(userId, id);
  }
}
