import {
  Controller, Get, Post, Delete, Param, Query, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InAppNotificationService } from './in-app-notification.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly inAppService: InAppNotificationService,
  ) {}

  /** Get notifications for current user */
  @Get()
  async list(
    @CurrentUser('_id') userId: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.inAppService.findByUser(userId, {
      unreadOnly: unreadOnly === 'true',
    });
  }

  /** Get unread count */
  @Get('unread-count')
  async unreadCount(@CurrentUser('_id') userId: string) {
    const count = await this.inAppService.countUnread(userId);
    return { count };
  }

  /** Mark single notification as read */
  @Post(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
  ) {
    await this.inAppService.markAsRead(id, userId);
    return { ok: true };
  }

  /** Mark all as read */
  @Post('read-all')
  async markAllAsRead(@CurrentUser('_id') userId: string) {
    const count = await this.inAppService.markAllAsRead(userId);
    return { marked: count };
  }

  /** Delete a notification */
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser('_id') userId: string,
  ) {
    await this.inAppService.delete(id, userId);
    return { ok: true };
  }
}
