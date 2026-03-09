import { Document, Types } from 'mongoose';
export type ChallengeDocument = Challenge & Document;
export declare class TestCase {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
}
export declare const TestCaseSchema: import("mongoose").Schema<TestCase, import("mongoose").Model<TestCase, any, any, any, Document<unknown, any, TestCase, any, {}> & TestCase & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TestCase, Document<unknown, {}, import("mongoose").FlatRecord<TestCase>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TestCase> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class Challenge {
    title: string;
    description: string;
    instructions: string;
    difficulty: string;
    tags: string[];
    category: string;
    points: number;
    starterCode: string;
    solutionCode: string;
    testCases: TestCase[];
    timeLimit: number;
    isActive: boolean;
    weekStart: Date;
    weekEnd: Date;
    isWeekly: boolean;
    totalSubmissions: number;
    totalCompletions: number;
}
export declare const ChallengeSchema: import("mongoose").Schema<Challenge, import("mongoose").Model<Challenge, any, any, any, Document<unknown, any, Challenge, any, {}> & Challenge & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Challenge, Document<unknown, {}, import("mongoose").FlatRecord<Challenge>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Challenge> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type ChallengeSubmissionDocument = ChallengeSubmission & Document;
export declare class ChallengeSubmission {
    userId: Types.ObjectId;
    challengeId: Types.ObjectId;
    code: string;
    language: string;
    status: string;
    score: number;
    testsTotal: number;
    testsPassed: number;
    executionTimeMs: number;
    feedback: string;
    submittedAt: Date;
}
export declare const ChallengeSubmissionSchema: import("mongoose").Schema<ChallengeSubmission, import("mongoose").Model<ChallengeSubmission, any, any, any, Document<unknown, any, ChallengeSubmission, any, {}> & ChallengeSubmission & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChallengeSubmission, Document<unknown, {}, import("mongoose").FlatRecord<ChallengeSubmission>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ChallengeSubmission> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
