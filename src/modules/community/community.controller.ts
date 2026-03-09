import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateMessageDto, CreateChannelDto } from './dto/community.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
  constructor(private readonly communityService: CommunityService) { }

  @Get('channels')
  async getChannels() {
    return this.communityService.getChannels();
  }

  @Post('channels')
  async createChannel(@Body() dto: CreateChannelDto) {
    return this.communityService.createChannel(dto);
  }

  @Get('channels/:channelId/messages')
  async getMessages(
    @Param('channelId') channelId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.communityService.getMessages(
      channelId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('channels/:channelId/pinned')
  async getPinnedMessages(@Param('channelId') channelId: string) {
    return this.communityService.getPinnedMessages(channelId);
  }

  @Post('messages')
  async createMessage(
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.communityService.createMessage(userId, dto);
  }

  @Put('messages/:id/like')
  async toggleLike(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.communityService.toggleLike(id, userId);
  }

  @Put('messages/:id/pin')
  async togglePin(@Param('id') id: string) {
    return this.communityService.togglePin(id);
  }

  @Get('messages/:id/replies')
  async getReplies(@Param('id') id: string) {
    return this.communityService.getReplies(id);
  }
}
