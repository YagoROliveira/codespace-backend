import { Model, Types } from 'mongoose';
import { ChallengeDocument, ChallengeSubmission, ChallengeSubmissionDocument } from './schemas/challenge.schema';
export declare class ChallengesService {
    private challengeModel;
    private submissionModel;
    constructor(challengeModel: Model<ChallengeDocument>, submissionModel: Model<ChallengeSubmissionDocument>);
    findAll(): Promise<ChallengeDocument[]>;
    findWeekly(): Promise<ChallengeDocument[]>;
    findById(id: string): Promise<ChallengeDocument>;
    submit(userId: string, challengeId: string, code: string, language: string): Promise<import("mongoose").Document<unknown, {}, ChallengeSubmissionDocument, {}, {}> & ChallengeSubmission & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getUserSubmissions(userId: string, challengeId?: string): Promise<(import("mongoose").Document<unknown, {}, ChallengeSubmissionDocument, {}, {}> & ChallengeSubmission & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getLeaderboard(challengeId?: string): Promise<any[]>;
    getUserStats(userId: string): Promise<{
        totalSubmissions: number;
        totalSolved: number;
        totalScore: number;
        streak: number;
    }>;
}
