import { CheckinsService } from './checkins.service';
export declare class CheckinsController {
    private readonly checkinsService;
    constructor(checkinsService: CheckinsService);
    create(userId: string, body: {
        studiedToday: string;
        difficulties: string;
        nextSteps: string;
        hoursStudied: number;
        mood: string;
        productivityScore: number;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/checkin.schema").CheckinDocument, {}, {}> & import("./schemas/checkin.schema").Checkin & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getToday(userId: string): Promise<import("mongoose").FlattenMaps<import("./schemas/checkin.schema").CheckinDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getHistory(userId: string, days?: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/checkin.schema").CheckinDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
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
    getStreak(userId: string): Promise<{
        streak: number;
    }>;
}
