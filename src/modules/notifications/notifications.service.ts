import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateService } from './email-template.service';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly adminEmail: string;
  private readonly smtpHost: string;
  private readonly smtpPort: number;
  private readonly smtpUser: string;
  private readonly smtpPass: string;
  private readonly fromEmail: string;

  constructor(
    private configService: ConfigService,
    private emailTemplateService: EmailTemplateService,
  ) {
    this.adminEmail = this.configService.get<string>('ADMIN_EMAIL') || '';
    this.smtpHost = this.configService.get<string>('SMTP_HOST') || '';
    this.smtpPort = parseInt(this.configService.get<string>('SMTP_PORT') || '587', 10);
    this.smtpUser = this.configService.get<string>('SMTP_USER') || '';
    this.smtpPass = this.configService.get<string>('SMTP_PASS') || '';
    this.fromEmail = this.configService.get<string>('SMTP_FROM') || 'mentoria@codespace.com.br';
  }

  /**
   * Send email using SMTP (nodemailer)
   * Falls back to logging if SMTP is not configured
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.smtpHost || !this.smtpUser) {
        this.logger.warn(`[EMAIL NOT SENT - SMTP not configured] To: ${options.to} | Subject: ${options.subject}`);
        this.logger.debug(`Email HTML: ${options.html}`);
        return false;
      }

      // Dynamic import to avoid build issues when nodemailer is not installed
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: this.smtpHost,
        port: this.smtpPort,
        secure: this.smtpPort === 465,
        auth: {
          user: this.smtpUser,
          pass: this.smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Codespace" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      this.logger.log(`Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
      return false;
    }
  }

  /**
   * Notify admin about a new subscription
   */
  async notifyNewSubscription(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
    billingCycle: string;
    amount: number;
  }): Promise<void> {
    const adminEmails = this.adminEmail || 'yagoribeiro21@gmail.com';
    const year = new Date().getFullYear().toString();
    const date = new Date().toLocaleDateString('pt-BR');

    const rendered = await this.emailTemplateService.renderTemplate(
      'purchase-confirmation',
      {
        studentName: data.studentName,
        planName: data.planName,
        billingCycle: data.billingCycle === 'yearly' ? 'Anual' : 'Mensal',
        amount: data.amount.toFixed(2),
        date,
        year,
      },
    );

    // Send to admin
    await this.sendEmail({
      to: adminEmails,
      subject: rendered?.subject || `🎉 Nova Assinatura - ${data.studentName} (${data.planName})`,
      html: rendered?.html || this.fallbackNewSubscriptionHtml(data),
    });
  }

  /**
   * Notify student that their account is now active
   */
  async notifyAccountActivated(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
    billingCycle?: string;
    amount?: number;
  }): Promise<void> {
    const year = new Date().getFullYear().toString();
    const date = new Date().toLocaleDateString('pt-BR');

    const rendered = await this.emailTemplateService.renderTemplate(
      'purchase-confirmation',
      {
        studentName: data.studentName,
        planName: data.planName,
        billingCycle: data.billingCycle === 'yearly' ? 'Anual' : 'Mensal',
        amount: data.amount ? data.amount.toFixed(2) : '—',
        date,
        year,
      },
    );

    await this.sendEmail({
      to: data.studentEmail,
      subject: rendered?.subject || `✅ Conta Ativada - Bem-vindo ao Codespace, ${data.studentName}!`,
      html: rendered?.html || this.fallbackAccountActivatedHtml(data),
    });
  }

  /**
   * Notify student that their account was deactivated due to payment issues
   */
  async notifyAccountDeactivated(data: {
    studentName: string;
    studentEmail: string;
    reason: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.studentEmail,
      subject: `⚠️ Conta Suspensa - Pendência de Pagamento`,
      html: this.fallbackAccountDeactivatedHtml(data),
    });
  }

  /**
   * Notify about payment failure
   */
  async notifyPaymentFailed(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
  }): Promise<void> {
    await this.sendEmail({
      to: data.studentEmail,
      subject: `❌ Falha no Pagamento - Codespace`,
      html: this.fallbackPaymentFailedHtml(data),
    });

    // Also notify admin
    if (this.adminEmail) {
      await this.sendEmail({
        to: this.adminEmail,
        subject: `⚠️ Falha no Pagamento - ${data.studentName}`,
        html: `<p>O pagamento de <strong>${data.studentName}</strong> (${data.studentEmail}) para o plano <strong>${data.planName}</strong> falhou.</p>`,
      });
    }
  }

  /**
   * Notify student about subscription cancellation
   */
  async notifySubscriptionCancelled(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
  }): Promise<void> {
    const year = new Date().getFullYear().toString();

    const rendered = await this.emailTemplateService.renderTemplate(
      'subscription-cancelled',
      {
        studentName: data.studentName,
        planName: data.planName,
        year,
      },
    );

    await this.sendEmail({
      to: data.studentEmail,
      subject: rendered?.subject || `😢 Sua assinatura foi cancelada - Codespace`,
      html: rendered?.html || `<p>Olá ${data.studentName}, sua assinatura do plano ${data.planName} foi cancelada.</p>`,
    });
  }

  /**
   * Notify student about abandoned checkout
   */
  async notifyAbandonedCheckout(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
    planSlug: string;
    billingCycle: string;
    amount: number;
  }): Promise<void> {
    const year = new Date().getFullYear().toString();

    const rendered = await this.emailTemplateService.renderTemplate(
      'abandoned-checkout',
      {
        studentName: data.studentName,
        planName: data.planName,
        planSlug: data.planSlug,
        billingCycle: data.billingCycle === 'yearly' ? 'Anual' : 'Mensal',
        billingCycleShort: data.billingCycle === 'yearly' ? 'ano' : 'mês',
        amount: data.amount.toFixed(2),
        year,
      },
    );

    await this.sendEmail({
      to: data.studentEmail,
      subject: rendered?.subject || `🛒 Você esqueceu algo? Finalize sua assinatura - Codespace`,
      html: rendered?.html || `<p>Olá ${data.studentName}, você não finalizou a assinatura do plano ${data.planName}.</p>`,
    });
  }

  // ─── Fallback Inline Templates (used when file template is unavailable) ───

  private fallbackNewSubscriptionHtml(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
    billingCycle: string;
    amount: number;
  }): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1b25; color: #e4e7e7; padding: 32px; border-radius: 12px;">
        <h1 style="color: #4589ba; font-size: 24px; margin-bottom: 16px;">🎉 Nova Assinatura!</h1>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px 0; color: #7a8585;">Aluno:</td><td style="padding: 8px 0; font-weight: bold;">${data.studentName}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a8585;">Email:</td><td style="padding: 8px 0;">${data.studentEmail}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a8585;">Plano:</td><td style="padding: 8px 0; font-weight: bold; color: #4589ba;">${data.planName}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a8585;">Ciclo:</td><td style="padding: 8px 0;">${data.billingCycle === 'yearly' ? 'Anual' : 'Mensal'}</td></tr>
          <tr><td style="padding: 8px 0; color: #7a8585;">Valor:</td><td style="padding: 8px 0; font-weight: bold; color: #4caf50;">R$ ${data.amount.toFixed(2)}</td></tr>
        </table>
        <p style="color: #7a8585; font-size: 12px; margin-top: 24px;">Codespace - Plataforma de Desenvolvimento</p>
      </div>
    `;
  }

  private fallbackAccountActivatedHtml(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
  }): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1b25; color: #e4e7e7; padding: 32px; border-radius: 12px;">
        <h1 style="color: #4caf50; font-size: 24px; margin-bottom: 16px;">✅ Conta Ativada!</h1>
        <p>Olá <strong>${data.studentName}</strong>,</p>
        <p>Seu pagamento foi confirmado e sua conta no plano <strong style="color: #4589ba;">${data.planName}</strong> está ativa!</p>
        <p>Agora você tem acesso completo à plataforma Codespace.</p>
        <div style="margin: 24px 0;">
          <a href="https://codespace.com.br/platform" style="display: inline-block; padding: 12px 24px; background: #4589ba; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Acessar Plataforma</a>
        </div>
        <p style="color: #7a8585; font-size: 12px; margin-top: 24px;">Codespace - Plataforma de Desenvolvimento</p>
      </div>
    `;
  }

  private fallbackAccountDeactivatedHtml(data: {
    studentName: string;
    studentEmail: string;
    reason: string;
  }): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1b25; color: #e4e7e7; padding: 32px; border-radius: 12px;">
        <h1 style="color: #ff9800; font-size: 24px; margin-bottom: 16px;">⚠️ Conta Suspensa</h1>
        <p>Olá <strong>${data.studentName}</strong>,</p>
        <p>Sua conta foi temporariamente suspensa devido a: <strong>${data.reason}</strong></p>
        <p>Para reativar sua conta, regularize seu pagamento:</p>
        <div style="margin: 24px 0;">
          <a href="https://codespace.com.br/platform/settings" style="display: inline-block; padding: 12px 24px; background: #ff9800; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Regularizar Pagamento</a>
        </div>
        <p style="color: #7a8585; font-size: 12px; margin-top: 24px;">Codespace - Plataforma de Desenvolvimento</p>
      </div>
    `;
  }

  private fallbackPaymentFailedHtml(data: {
    studentName: string;
    studentEmail: string;
    planName: string;
  }): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1b25; color: #e4e7e7; padding: 32px; border-radius: 12px;">
        <h1 style="color: #f44336; font-size: 24px; margin-bottom: 16px;">❌ Falha no Pagamento</h1>
        <p>Olá <strong>${data.studentName}</strong>,</p>
        <p>Infelizmente, houve uma falha no processamento do seu pagamento para o plano <strong style="color: #4589ba;">${data.planName}</strong>.</p>
        <p>Por favor, tente novamente ou utilize outro método de pagamento:</p>
        <div style="margin: 24px 0;">
          <a href="https://codespace.com.br/platform/settings" style="display: inline-block; padding: 12px 24px; background: #4589ba; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">Tentar Novamente</a>
        </div>
        <p style="color: #7a8585; font-size: 12px; margin-top: 24px;">Codespace - Plataforma de Desenvolvimento</p>
      </div>
    `;
  }
}
