import { Document, Types } from 'mongoose';
export type CodeEvaluationDocument = CodeEvaluation & Document;
export declare class EvaluationCriterion {
    name: string;
    score: number;
    comment: string;
}
export declare const EvaluationCriterionSchema: import("mongoose").Schema<EvaluationCriterion, import("mongoose").Model<EvaluationCriterion, any, any, any, Document<unknown, any, EvaluationCriterion, any, {}> & EvaluationCriterion & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EvaluationCriterion, Document<unknown, {}, import("mongoose").FlatRecord<EvaluationCriterion>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<EvaluationCriterion> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class CodeEvaluation {
    studentId: Types.ObjectId;
    reviewerId: Types.ObjectId;
    trackId: Types.ObjectId;
    title: string;
    description: string;
    language: string;
    codeSnippet: string;
    repositoryUrl: string;
    criteria: EvaluationCriterion[];
    overallScore: number;
    status: string;
    feedback: string;
    strengths: string;
    improvements: string;
    evaluatedAt: Date;
}
export declare const CodeEvaluationSchema: import("mongoose").Schema<CodeEvaluation, import("mongoose").Model<CodeEvaluation, any, any, any, Document<unknown, any, CodeEvaluation, any, {}> & CodeEvaluation & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, CodeEvaluation, Document<unknown, {}, import("mongoose").FlatRecord<CodeEvaluation>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<CodeEvaluation> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
