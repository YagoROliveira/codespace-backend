import { Model, Types } from 'mongoose';
import { ChallengeDocument, ChallengeSubmission, ChallengeSubmissionDocument } from './schemas/challenge.schema';
export declare class ChallengesService {
    private challengeModel;
    private submissionModel;
    constructor(challengeModel: Model<ChallengeDocument>, submissionModel: Model<ChallengeSubmissionDocument>);
    findAll(): Promise<any[]>;
    findWeekly(): Promise<any[]>;
    findById(id: string): Promise<any>;
    submit(userId: string, challengeId: string, code: string, language: string): Promise<import("mongoose").Document<unknown, {}, ChallengeSubmissionDocument, {}, {}> & ChallengeSubmission & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getUserSubmissions(userId: string, challengeId?: string): Promise<(import("mongoose").FlattenMaps<ChallengeSubmissionDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getLeaderboard(challengeId?: string): Promise<any[]>;
    getUserStats(userId: string): Promise<{
        totalSubmissions: any;
        totalSolved: any;
        totalScore: any;
        streak: number;
    }>;
}
