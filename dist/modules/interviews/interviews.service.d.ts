import { Model, Types } from 'mongoose';
import { InterviewQuestionDocument, InterviewSession, InterviewSessionDocument } from './schemas/interview.schema';
export declare class InterviewsService {
    private questionModel;
    private sessionModel;
    constructor(questionModel: Model<InterviewQuestionDocument>, sessionModel: Model<InterviewSessionDocument>);
    getQuestions(type?: string, level?: string): Promise<any[]>;
    startSession(userId: string, type: string, level: string, questionCount?: number): Promise<{
        session: import("mongoose").Document<unknown, {}, InterviewSessionDocument, {}, {}> & InterviewSession & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        questions: any[];
    }>;
    submitAnswer(userId: string, sessionId: string, questionId: string, answer: string, timeSpent: number): Promise<{
        score: number;
        feedback: string;
        session: import("mongoose").Document<unknown, {}, InterviewSessionDocument, {}, {}> & InterviewSession & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    getUserSessions(userId: string): Promise<(import("mongoose").FlattenMaps<InterviewSessionDocument> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getSessionById(userId: string, sessionId: string): Promise<{
        session: import("mongoose").FlattenMaps<InterviewSessionDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        questions: (import("mongoose").FlattenMaps<InterviewQuestionDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    getUserStats(userId: string): Promise<{
        totalSessions: any;
        avgScore: number;
        bestScore: any;
        totalQuestions: any;
    }>;
}
