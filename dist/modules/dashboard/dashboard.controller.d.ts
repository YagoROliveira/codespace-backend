import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(userId: string): Promise<{
        user: {
            name: string;
            plan: string;
            streakDays: number;
            totalHours: number;
        };
        stats: {
            activeTracks: number;
            completedTracks: number;
            totalHours: number;
            totalSessions: number;
            streakDays: number;
        };
        activeTracks: {
            track: import("mongoose").Types.ObjectId;
            progressPercent: number;
            completedLessons: number;
            startedAt: Date;
        }[];
        upcomingSessions: (import("mongoose").Document<unknown, {}, import("../sessions/schemas/session.schema").SessionDocument, {}, {}> & import("../sessions/schemas/session.schema").Session & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
