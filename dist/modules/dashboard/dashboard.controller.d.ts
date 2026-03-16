import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(userId: string): Promise<{
        user: {
            name: string;
            avatar: string;
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
            totalLessonsCompleted: number;
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
        cronogram: any;
        todayPlan: any[];
        nextLesson: any;
        recentJobs: {
            _id: any;
            title: string;
            company: string;
            companyLogo: string;
            type: string;
            level: string;
            location: string;
            salaryRange: string;
            tags: string[];
            isFeatured: boolean;
            isExclusive: boolean;
        }[];
        jobsTotal: number;
        recentCommunity: {
            _id: any;
            content: string;
            user: import("mongoose").Types.ObjectId;
            channel: import("mongoose").Types.ObjectId;
            createdAt: any;
        }[];
        todayCheckin: {
            mood: string;
            hoursStudied: number;
            productivityScore: number;
        };
        weeklyStudy: {
            totalHours: number;
            avgProductivity: number;
            checkinsDone: number;
        };
    }>;
}
