import {
  Controller, Get, Post, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { InAppNotificationService } from './in-app-notification.service';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly inAppService: InAppNotificationService,
    private readonly notificationsService: NotificationsService,
  ) { }

  /** Admin: Send a test email to verify SMTP configuration */
  @Post('test-email')
  @Roles('admin')
  async testEmail(
    @Body('to') to: string,
    @CurrentUser('email') adminEmail: string,
  ) {
    const recipient = to || adminEmail;
    const success = await this.notificationsService.sendEmail({
      to: recipient,
      subject: '✅ Codespace - Email de Teste',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1b25; color: #e4e7e7; padding: 32px; border-radius: 12px;">
          <h1 style="color: #4caf50; font-size: 24px; margin-bottom: 16px;">✅ Email funcionando!</h1>
          <p>Se você está lendo isso, o envio de emails da plataforma <strong style="color: #4589ba;">Codespace</strong> está configurado corretamente.</p>
          <p style="color: #7a8585; margin-top: 16px;">Enviado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          <p style="color: #7a8585; font-size: 12px; margin-top: 24px;">Codespace - Plataforma de Desenvolvimento</p>
        </div>
      `,
    });
    return { success, sentTo: recipient };
  }

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
