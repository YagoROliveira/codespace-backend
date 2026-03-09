import { Document, Types } from 'mongoose';
export type UserTrackProgressDocument = UserTrackProgress & Document;
export declare class LessonProgress {
    lessonId: Types.ObjectId;
    completed: boolean;
    completedAt: Date;
}
export declare const LessonProgressSchema: import("mongoose").Schema<LessonProgress, import("mongoose").Model<LessonProgress, any, any, any, Document<unknown, any, LessonProgress, any, {}> & LessonProgress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, LessonProgress, Document<unknown, {}, import("mongoose").FlatRecord<LessonProgress>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<LessonProgress> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class UserTrackProgress {
    userId: Types.ObjectId;
    trackId: Types.ObjectId;
    status: string;
    progressPercent: number;
    completedLessons: number;
    lessonProgress: LessonProgress[];
    startedAt: Date;
    completedAt: Date;
}
export declare const UserTrackProgressSchema: import("mongoose").Schema<UserTrackProgress, import("mongoose").Model<UserTrackProgress, any, any, any, Document<unknown, any, UserTrackProgress, any, {}> & UserTrackProgress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserTrackProgress, Document<unknown, {}, import("mongoose").FlatRecord<UserTrackProgress>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<UserTrackProgress> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
