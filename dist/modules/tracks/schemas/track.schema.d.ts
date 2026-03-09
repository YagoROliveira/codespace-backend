import { Document, Types } from 'mongoose';
export type TrackDocument = Track & Document;
export declare class Lesson {
    title: string;
    description: string;
    videoUrl: string;
    content: string;
    durationMinutes: number;
    order: number;
}
export declare const LessonSchema: import("mongoose").Schema<Lesson, import("mongoose").Model<Lesson, any, any, any, Document<unknown, any, Lesson, any, {}> & Lesson & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Lesson, Document<unknown, {}, import("mongoose").FlatRecord<Lesson>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Lesson> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class TrackDocument_ {
    _id: Types.ObjectId;
    title: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSizeKb: number;
    uploadedAt: Date;
}
export declare const TrackDocumentSchema: import("mongoose").Schema<TrackDocument_, import("mongoose").Model<TrackDocument_, any, any, any, Document<unknown, any, TrackDocument_, any, {}> & TrackDocument_ & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TrackDocument_, Document<unknown, {}, import("mongoose").FlatRecord<TrackDocument_>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TrackDocument_> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class Track {
    title: string;
    description: string;
    icon: string;
    color: string;
    tags: string[];
    difficulty: string;
    totalLessons: number;
    estimatedHours: number;
    lessons: Lesson[];
    requiredPlans: string[];
    isPublished: boolean;
    order: number;
    documents: TrackDocument_[];
}
export declare const TrackSchema: import("mongoose").Schema<Track, import("mongoose").Model<Track, any, any, any, Document<unknown, any, Track, any, {}> & Track & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Track, Document<unknown, {}, import("mongoose").FlatRecord<Track>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Track> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
