import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { EmailTemplateService } from './email-template.service';
import { InAppNotificationService } from './in-app-notification.service';
import { NotificationsController } from './notifications.controller';
import {
  EmailTemplate,
  EmailTemplateSchema,
} from './schemas/email-template.schema';
import {
  InAppNotification,
  InAppNotificationSchema,
} from './schemas/in-app-notification.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
      { name: InAppNotification.name, schema: InAppNotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailTemplateService, InAppNotificationService],
  exports: [NotificationsService, EmailTemplateService, InAppNotificationService],
})
export class NotificationsModule {}
