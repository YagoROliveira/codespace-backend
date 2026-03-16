import { Model, Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { UserTrackProgressDocument } from '../tracks/schemas/user-track-progress.schema';
import { SessionDocument } from '../sessions/schemas/session.schema';
import { TrackDocument } from '../tracks/schemas/track.schema';
import { StudyCronogramDocument } from '../admin/schemas/study-cronogram.schema';
import { JobDocument } from '../jobs/schemas/job.schema';
import { MessageDocument } from '../community/schemas/message.schema';
import { CheckinDocument } from '../checkins/schemas/checkin.schema';
export declare class DashboardService {
    private userModel;
    private progressModel;
    private sessionModel;
    private trackModel;
    private cronogramModel;
    private jobModel;
    private messageModel;
    private checkinModel;
    constructor(userModel: Model<UserDocument>, progressModel: Model<UserTrackProgressDocument>, sessionModel: Model<SessionDocument>, trackModel: Model<TrackDocument>, cronogramModel: Model<StudyCronogramDocument>, jobModel: Model<JobDocument>, messageModel: Model<MessageDocument>, checkinModel: Model<CheckinDocument>);
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
            track: Types.ObjectId;
            progressPercent: number;
            completedLessons: number;
            startedAt: Date;
        }[];
        upcomingSessions: (import("mongoose").FlattenMaps<SessionDocument> & Required<{
            _id: Types.ObjectId;
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
            user: Types.ObjectId;
            channel: Types.ObjectId;
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
