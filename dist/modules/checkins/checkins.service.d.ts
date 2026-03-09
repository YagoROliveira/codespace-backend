import { Model, Types } from 'mongoose';
import { Checkin, CheckinDocument } from './schemas/checkin.schema';
export declare class CheckinsService {
    private checkinModel;
    constructor(checkinModel: Model<CheckinDocument>);
    create(userId: string, data: {
        studiedToday: string;
        difficulties: string;
        nextSteps: string;
        hoursStudied: number;
        mood: string;
        productivityScore: number;
    }): Promise<import("mongoose").Document<unknown, {}, CheckinDocument, {}, {}> & Checkin & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getToday(userId: string): Promise<import("mongoose").Document<unknown, {}, CheckinDocument, {}, {}> & Checkin & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getHistory(userId: string, days?: number): Promise<(import("mongoose").Document<unknown, {}, CheckinDocument, {}, {}> & Checkin & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getWeeklyReport(userId: string): Promise<{
        totalDays: number;
        totalHours: number;
        avgProductivity: number;
        moods: {
            date: string;
            mood: string;
        }[];
        streak: number;
    }>;
    getStreak(userId: string): Promise<number>;
}
