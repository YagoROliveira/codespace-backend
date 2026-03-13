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
        upcomingSessions: (import("mongoose").FlattenMaps<import("../sessions/schemas/session.schema").SessionDocument> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
