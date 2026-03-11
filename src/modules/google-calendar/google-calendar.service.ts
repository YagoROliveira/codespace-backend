import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';

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

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar: calendar_v3.Calendar | null = null;
  private calendarId: string;

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

    try {
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, '\n'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      this.calendar = google.calendar({ version: 'v3', auth });
      this.logger.log('Google Calendar client initialized');
    } catch (err) {
      this.logger.error('Failed to initialize Google Calendar client', err);
    }
  }

  isConfigured(): boolean {
    return this.calendar !== null;
  }

  async createEvent(input: CalendarEventInput): Promise<CalendarEventResult | null> {
    if (!this.calendar) {
      this.logger.warn('Google Calendar not configured, skipping event creation');
      return null;
    }

    const startDate = new Date(input.startDateTime);
    const endDate = new Date(startDate.getTime() + input.durationMinutes * 60000);

    try {
      const res = await this.calendar.events.insert({
        calendarId: this.calendarId,
        conferenceDataVersion: 1,
        sendUpdates: 'all', // Send email invites to all attendees
        requestBody: {
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
      });

      const event = res.data;
      const meetingUrl =
        event.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri || '';

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
    if (!this.calendar) return null;

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

      const res = await this.calendar.events.patch({
        calendarId: this.calendarId,
        eventId,
        sendUpdates: 'all',
        requestBody: body,
      });

      const event = res.data;
      const meetingUrl =
        event.conferenceData?.entryPoints?.find((ep) => ep.entryPointType === 'video')?.uri || '';

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
    if (!this.calendar) return false;

    try {
      await this.calendar.events.delete({
        calendarId: this.calendarId,
        eventId,
        sendUpdates: 'all', // Notify attendees of cancellation
      });
      this.logger.log(`Deleted calendar event: ${eventId}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to delete calendar event ${eventId}`, err);
      return false;
    }
  }
}
