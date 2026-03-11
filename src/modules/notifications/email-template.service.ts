import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailTemplate, EmailTemplateDocument } from './schemas/email-template.schema';
import * as fs from 'fs';
import * as path from 'path';

/** Default template seeds — inserted on first boot if missing */
const DEFAULT_TEMPLATES: Omit<EmailTemplate, 'isActive'>[] = [
  {
    slug: 'purchase-confirmation',
    name: 'Confirmação de Compra',
    subject: '✅ Conta Ativada - Bem-vindo ao Codespace, {{studentName}}!',
    description: 'Enviado ao aluno após confirmação do pagamento',
    filePath: 'purchase-confirmation.html',
  },
  {
    slug: 'subscription-cancelled',
    name: 'Assinatura Cancelada',
    subject: '😢 Sua assinatura foi cancelada - Codespace',
    description: 'Enviado ao aluno quando cancela a assinatura',
    filePath: 'subscription-cancelled.html',
  },
  {
    slug: 'abandoned-checkout',
    name: 'Checkout Abandonado',
    subject: '🛒 Você esqueceu algo? Finalize sua assinatura - Codespace',
    description: 'Enviado ao aluno que iniciou mas não finalizou o pagamento',
    filePath: 'abandoned-checkout.html',
  },
  {
    slug: 'new-subscription-admin',
    name: 'Nova Assinatura (Admin)',
    subject: '🎉 Nova Assinatura - {{studentName}} ({{planName}})',
    description: 'Notificação enviada ao admin sobre nova assinatura',
    filePath: 'purchase-confirmation.html',
  },
  {
    slug: 'account-deactivated',
    name: 'Conta Suspensa',
    subject: '⚠️ Conta Suspensa - Pendência de Pagamento',
    description: 'Enviado ao aluno quando a conta é suspensa por falta de pagamento',
    filePath: 'subscription-cancelled.html',
  },
  {
    slug: 'payment-failed',
    name: 'Falha no Pagamento',
    subject: '❌ Falha no Pagamento - Codespace',
    description: 'Enviado ao aluno quando o pagamento falha',
    filePath: 'subscription-cancelled.html',
  },
];

@Injectable()
export class EmailTemplateService implements OnModuleInit {
  private readonly logger = new Logger(EmailTemplateService.name);
  private readonly templatesDir: string;

  constructor(
    @InjectModel(EmailTemplate.name)
    private templateModel: Model<EmailTemplateDocument>,
  ) {
    // Resolve templates directory relative to this file's compiled location
    // In dev: backend/src/templates/emails  |  In dist: backend/dist/templates/emails
    this.templatesDir = path.resolve(__dirname, '..', '..', 'templates', 'emails');
  }

  /** Seed default templates on application start */
  async onModuleInit(): Promise<void> {
    for (const tpl of DEFAULT_TEMPLATES) {
      const exists = await this.templateModel.findOne({ slug: tpl.slug }).exec();
      if (!exists) {
        await this.templateModel.create(tpl);
        this.logger.log(`Seeded email template: ${tpl.slug}`);
      }
    }
  }

  /** Find a template record by slug */
  async getTemplate(slug: string): Promise<EmailTemplateDocument | null> {
    return this.templateModel.findOne({ slug, isActive: true }).exec();
  }

  /** List all templates */
  async listTemplates(): Promise<EmailTemplateDocument[]> {
    return this.templateModel.find().sort({ slug: 1 }).exec();
  }

  /**
   * Load the HTML file for a template and replace `{{variable}}` placeholders.
   * Returns null if the template is not found or the file cannot be read.
   */
  async renderTemplate(
    slug: string,
    variables: Record<string, string>,
  ): Promise<{ subject: string; html: string } | null> {
    const template = await this.getTemplate(slug);
    if (!template) {
      this.logger.warn(`Email template "${slug}" not found or inactive`);
      return null;
    }

    const filePath = path.join(this.templatesDir, template.filePath);

    let html: string;
    try {
      html = fs.readFileSync(filePath, 'utf-8');
    } catch (err: any) {
      this.logger.error(
        `Could not read template file "${filePath}": ${err.message}`,
      );
      return null;
    }

    // Replace variables in both subject and html
    let subject = template.subject;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      html = html.replace(regex, value);
      subject = subject.replace(regex, value);
    }

    return { subject, html };
  }
}
