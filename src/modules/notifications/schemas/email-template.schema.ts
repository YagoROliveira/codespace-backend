import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailTemplateDocument = EmailTemplate & Document;

@Schema({ timestamps: true })
export class EmailTemplate {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  subject: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  filePath: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
