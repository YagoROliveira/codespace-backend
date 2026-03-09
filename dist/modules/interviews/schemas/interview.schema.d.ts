import { Document, Types } from 'mongoose';
export type InterviewQuestionDocument = InterviewQuestion & Document;
export declare class InterviewQuestion {
    title: string;
    question: string;
    hints: string;
    idealAnswer: string;
    type: string;
    level: string;
    category: string;
    tags: string[];
    company: string;
    timeLimitMinutes: number;
    isActive: boolean;
}
export declare const InterviewQuestionSchema: import("mongoose").Schema<InterviewQuestion, import("mongoose").Model<InterviewQuestion, any, any, any, Document<unknown, any, InterviewQuestion, any, {}> & InterviewQuestion & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InterviewQuestion, Document<unknown, {}, import("mongoose").FlatRecord<InterviewQuestion>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<InterviewQuestion> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type InterviewSessionDocument = InterviewSession & Document;
export declare class InterviewAnswer {
    questionId: Types.ObjectId;
    answer: string;
    score: number;
    feedback: string;
    timeSpentSeconds: number;
}
export declare const InterviewAnswerSchema: import("mongoose").Schema<InterviewAnswer, import("mongoose").Model<InterviewAnswer, any, any, any, Document<unknown, any, InterviewAnswer, any, {}> & InterviewAnswer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InterviewAnswer, Document<unknown, {}, import("mongoose").FlatRecord<InterviewAnswer>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<InterviewAnswer> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class InterviewSession {
    userId: Types.ObjectId;
    type: string;
    level: string;
    status: string;
    answers: InterviewAnswer[];
    totalScore: number;
    totalQuestions: number;
    answeredQuestions: number;
    overallFeedback: string;
    startedAt: Date;
    completedAt: Date;
}
export declare const InterviewSessionSchema: import("mongoose").Schema<InterviewSession, import("mongoose").Model<InterviewSession, any, any, any, Document<unknown, any, InterviewSession, any, {}> & InterviewSession & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InterviewSession, Document<unknown, {}, import("mongoose").FlatRecord<InterviewSession>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<InterviewSession> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
