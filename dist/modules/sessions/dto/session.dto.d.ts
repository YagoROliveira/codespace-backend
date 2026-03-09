export declare class CreateSessionDto {
    title: string;
    description?: string;
    scheduledAt: string;
    durationMinutes?: number;
    meetingUrl?: string;
    topics?: string[];
    type?: string;
}
export declare class UpdateSessionDto {
    title?: string;
    description?: string;
    scheduledAt?: string;
    durationMinutes?: number;
    status?: string;
    meetingUrl?: string;
    recordingUrl?: string;
    notes?: string;
}
