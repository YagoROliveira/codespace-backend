import { Document, Types } from 'mongoose';
export type ProjectDocument = Project & Document;
export declare class Project {
    title: string;
    description: string;
    longDescription: string;
    difficulty: string;
    category: string;
    technologies: string[];
    features: string[];
    repoUrl: string;
    demoUrl: string;
    thumbnailUrl: string;
    estimatedHours: number;
    participants: number;
    isActive: boolean;
    isFeatured: boolean;
    learningGoals: string[];
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any, {}> & Project & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Project> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type UserProjectDocument = UserProject & Document;
export declare class UserProject {
    userId: Types.ObjectId;
    projectId: Types.ObjectId;
    status: string;
    repoUrl: string;
    deployUrl: string;
    mentorFeedback: string;
    score: number;
    startedAt: Date;
    submittedAt: Date;
    reviewedAt: Date;
}
export declare const UserProjectSchema: import("mongoose").Schema<UserProject, import("mongoose").Model<UserProject, any, any, any, Document<unknown, any, UserProject, any, {}> & UserProject & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserProject, Document<unknown, {}, import("mongoose").FlatRecord<UserProject>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<UserProject> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
