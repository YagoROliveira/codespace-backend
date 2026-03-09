import { Document, Types } from 'mongoose';
export type CheckinDocument = Checkin & Document;
export declare class Checkin {
    userId: Types.ObjectId;
    date: string;
    studiedToday: string;
    difficulties: string;
    nextSteps: string;
    hoursStudied: number;
    mood: string;
    productivityScore: number;
    mentorNote: string;
}
export declare const CheckinSchema: import("mongoose").Schema<Checkin, import("mongoose").Model<Checkin, any, any, any, Document<unknown, any, Checkin, any, {}> & Checkin & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Checkin, Document<unknown, {}, import("mongoose").FlatRecord<Checkin>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Checkin> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
