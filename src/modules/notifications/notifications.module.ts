import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { EmailTemplateService } from './email-template.service';
import {
  EmailTemplate,
  EmailTemplateSchema,
} from './schemas/email-template.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
  ],
  providers: [NotificationsService, EmailTemplateService],
  exports: [NotificationsService, EmailTemplateService],
})
export class NotificationsModule { }
