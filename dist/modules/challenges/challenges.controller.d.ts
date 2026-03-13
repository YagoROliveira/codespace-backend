import { ChallengesService } from './challenges.service';
export declare class ChallengesController {
    private readonly challengesService;
    constructor(challengesService: ChallengesService);
    findAll(): Promise<any[]>;
    getWeekly(): Promise<any[]>;
    getLeaderboard(): Promise<any[]>;
    getMyStats(userId: string): Promise<{
        totalSubmissions: any;
        totalSolved: any;
        totalScore: any;
        streak: number;
    }>;
    getMySubmissions(userId: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/challenge.schema").ChallengeSubmissionDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<any>;
    getChallengeSubmissions(userId: string, id: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/challenge.schema").ChallengeSubmissionDocument> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    submit(userId: string, id: string, body: {
        code: string;
        language: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/challenge.schema").ChallengeSubmissionDocument, {}, {}> & import("./schemas/challenge.schema").ChallengeSubmission & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
