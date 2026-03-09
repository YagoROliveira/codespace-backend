import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) { }

  @Public()
  @Get()
  async findAll() {
    return this.tracksService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/my-tracks')
  async getUserTracks(@CurrentUser('_id') userId: string) {
    return this.tracksService.getUserTracks(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/detail')
  async getTrackDetail(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.tracksService.getTrackDetail(id, userId);
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.tracksService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':trackId/start')
  async startTrack(
    @CurrentUser('_id') userId: string,
    @Param('trackId') trackId: string,
  ) {
    return this.tracksService.startTrack(userId, trackId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':trackId/lessons/:lessonId/complete')
  async completeLesson(
    @CurrentUser() user: any,
    @Param('trackId') trackId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.tracksService.completeLesson(user._id, trackId, lessonId, user.name);
  }
}
