import { Document, Types } from 'mongoose';
export type SessionDocument = Session & Document;
export declare class ProntuarioEntry {
    _id: Types.ObjectId;
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    notes: string;
    authorId: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class Session {
    userId: Types.ObjectId;
    mentorId: Types.ObjectId;
    title: string;
    description: string;
    scheduledAt: Date;
    durationMinutes: number;
    status: string;
    meetingUrl: string;
    recordingUrl: string;
    notes: string;
    topics: string[];
    type: string;
    studentNoShow: boolean;
    noShowMarkedAt: Date;
    prontuario: ProntuarioEntry[];
    lastNotifiedAt: Date;
    notificationCount: number;
}
export declare const SessionSchema: import("mongoose").Schema<Session, import("mongoose").Model<Session, any, any, any, Document<unknown, any, Session, any, {}> & Session & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Session, Document<unknown, {}, import("mongoose").FlatRecord<Session>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Session> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
