import { InterviewsService } from './interviews.service';
export declare class InterviewsController {
    private readonly interviewsService;
    constructor(interviewsService: InterviewsService);
    getQuestions(type?: string, level?: string): Promise<import("./schemas/interview.schema").InterviewQuestionDocument[]>;
    getMySessions(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/interview.schema").InterviewSessionDocument, {}, {}> & import("./schemas/interview.schema").InterviewSession & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getMyStats(userId: string): Promise<{
        totalSessions: number;
        avgScore: number;
        bestScore: number;
        totalQuestions: number;
    }>;
    getSession(userId: string, id: string): Promise<{
        session: import("mongoose").Document<unknown, {}, import("./schemas/interview.schema").InterviewSessionDocument, {}, {}> & import("./schemas/interview.schema").InterviewSession & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        questions: (import("mongoose").Document<unknown, {}, import("./schemas/interview.schema").InterviewQuestionDocument, {}, {}> & import("./schemas/interview.schema").InterviewQuestion & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    startSession(userId: string, body: {
        type: string;
        level: string;
        questionCount?: number;
    }): Promise<{
        session: import("mongoose").Document<unknown, {}, import("./schemas/interview.schema").InterviewSessionDocument, {}, {}> & import("./schemas/interview.schema").InterviewSession & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        questions: any[];
    }>;
    submitAnswer(userId: string, sessionId: string, body: {
        questionId: string;
        answer: string;
        timeSpent: number;
    }): Promise<{
        score: number;
        feedback: string;
        session: import("mongoose").Document<unknown, {}, import("./schemas/interview.schema").InterviewSessionDocument, {}, {}> & import("./schemas/interview.schema").InterviewSession & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
}
