import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface CalendarEventInput {
  summary: string;
  description?: string;
  startDateTime: string; // ISO string
  durationMinutes: number;
  attendees: { email: string; displayName?: string }[];
}

export interface CalendarEventResult {
  eventId: string;
  meetingUrl: string;
  htmlLink: string;
}

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/calendar';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private clientEmail: string | null = null;
  private privateKey: string | null = null;
  private calendarId: string;
  private accessToken: string | null = null;
  private tokenExpiry = 0;

  constructor(private configService: ConfigService) {
    this.calendarId = this.configService.get<string>('GOOGLE_CALENDAR_ID') || 'primary';
    this.initClient();
  }

  private initClient() {
    const clientEmail = this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_EMAIL');
    const privateKey = this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');

    if (!clientEmail || !privateKey) {
      this.logger.warn(
        'Google Calendar credentials not configured. Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.',
      );
      return;
    }

    this.clientEmail = clientEmail;
    this.privateKey = privateKey.replace(/\\n/g, '\n');
    this.logger.log('Google Calendar client initialized (lightweight)');
  }

  isConfigured(): boolean {
    return this.clientEmail !== null && this.privateKey !== null;
  }

  /** Create a signed JWT for Google service account auth */
  private createJwt(): string {
    const now = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      iss: this.clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })).toString('base64url');

    const signInput = `${header}.${payload}`;
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signInput);
    const signature = sign.sign(this.privateKey!, 'base64url');

    return `${signInput}.${signature}`;
  }

  /** Get a valid access token, refreshing if expired */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const jwt = this.createJwt();
    const res = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Token exchange failed: ${res.status} ${err}`);
    }

    const data = await res.json() as { access_token: string; expires_in: number };
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // refresh 60s early
    return this.accessToken;
  }

  /** Make an authenticated request to Google Calendar API */
  private async calendarFetch(
    path: string,
    method: string,
    body?: Record<string, any>,
    params?: Record<string, string>,
  ): Promise<any> {
    const token = await this.getAccessToken();
    const url = new URL(`${CALENDAR_API}${path}`);
    if (params) {
      for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    }

    const res = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (method === 'DELETE' && res.status === 204) return null;

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Calendar API ${method} ${path} failed: ${res.status} ${err}`);
    }

    return res.json();
  }

  async createEvent(input: CalendarEventInput): Promise<CalendarEventResult | null> {
    if (!this.isConfigured()) {
      this.logger.warn('Google Calendar not configured, skipping event creation');
      return null;
    }

    const startDate = new Date(input.startDateTime);
    const endDate = new Date(startDate.getTime() + input.durationMinutes * 60000);

    try {
      const event = await this.calendarFetch(
        `/calendars/${encodeURIComponent(this.calendarId)}/events`,
        'POST',
        {
          summary: input.summary,
          description: input.description || '',
          start: {
            dateTime: startDate.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: 'America/Sao_Paulo',
          },
          attendees: input.attendees.map((a) => ({
            email: a.email,
            displayName: a.displayName,
          })),
          conferenceData: {
            createRequest: {
              requestId: `codespace-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          },
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 60 },
              { method: 'popup', minutes: 15 },
            ],
          },
        },
        { conferenceDataVersion: '1', sendUpdates: 'all' },
      );

      const meetingUrl =
        event.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri || '';

      this.logger.log(`Created calendar event: ${event.id} with Meet: ${meetingUrl}`);

      return {
        eventId: event.id || '',
        meetingUrl,
        htmlLink: event.htmlLink || '',
      };
    } catch (err) {
      this.logger.error('Failed to create calendar event', err);
      return null;
    }
  }

  async updateEvent(
    eventId: string,
    input: Partial<CalendarEventInput>,
  ): Promise<CalendarEventResult | null> {
    if (!this.isConfigured()) return null;

    try {
      const body: any = {};

      if (input.summary) body.summary = input.summary;
      if (input.description !== undefined) body.description = input.description;

      if (input.startDateTime) {
        const startDate = new Date(input.startDateTime);
        const endDate = new Date(
          startDate.getTime() + (input.durationMinutes || 60) * 60000,
        );
        body.start = { dateTime: startDate.toISOString(), timeZone: 'America/Sao_Paulo' };
        body.end = { dateTime: endDate.toISOString(), timeZone: 'America/Sao_Paulo' };
      }

      if (input.attendees) {
        body.attendees = input.attendees.map((a) => ({
          email: a.email,
          displayName: a.displayName,
        }));
      }

      const event = await this.calendarFetch(
        `/calendars/${encodeURIComponent(this.calendarId)}/events/${encodeURIComponent(eventId)}`,
        'PATCH',
        body,
        { sendUpdates: 'all' },
      );

      const meetingUrl =
        event.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri || '';

      this.logger.log(`Updated calendar event: ${eventId}`);

      return {
        eventId: event.id || '',
        meetingUrl: meetingUrl || '',
        htmlLink: event.htmlLink || '',
      };
    } catch (err) {
      this.logger.error(`Failed to update calendar event ${eventId}`, err);
      return null;
    }
  }

  async deleteEvent(eventId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      await this.calendarFetch(
        `/calendars/${encodeURIComponent(this.calendarId)}/events/${encodeURIComponent(eventId)}`,
        'DELETE',
        undefined,
        { sendUpdates: 'all' },
      );
      this.logger.log(`Deleted calendar event: ${eventId}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to delete calendar event ${eventId}`, err);
      return false;
    }
  }
}
