import { Model, Types } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { UserTrackProgressDocument } from '../tracks/schemas/user-track-progress.schema';
import { Session, SessionDocument } from '../sessions/schemas/session.schema';
import { TrackDocument } from '../tracks/schemas/track.schema';
export declare class DashboardService {
    private userModel;
    private progressModel;
    private sessionModel;
    private trackModel;
    constructor(userModel: Model<UserDocument>, progressModel: Model<UserTrackProgressDocument>, sessionModel: Model<SessionDocument>, trackModel: Model<TrackDocument>);
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
            track: Types.ObjectId;
            progressPercent: number;
            completedLessons: number;
            startedAt: Date;
        }[];
        upcomingSessions: (import("mongoose").Document<unknown, {}, SessionDocument, {}, {}> & Session & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
