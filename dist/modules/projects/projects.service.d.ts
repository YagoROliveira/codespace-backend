import { Model, Types } from 'mongoose';
import { Project, ProjectDocument, UserProject, UserProjectDocument } from './schemas/project.schema';
export declare class ProjectsService {
    private projectModel;
    private userProjectModel;
    constructor(projectModel: Model<ProjectDocument>, userProjectModel: Model<UserProjectDocument>);
    findAll(difficulty?: string): Promise<ProjectDocument[]>;
    findById(id: string): Promise<ProjectDocument>;
    startProject(userId: string, projectId: string): Promise<import("mongoose").Document<unknown, {}, UserProjectDocument, {}, {}> & UserProject & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    submitProject(userId: string, projectId: string, repoUrl: string, deployUrl?: string): Promise<import("mongoose").Document<unknown, {}, UserProjectDocument, {}, {}> & UserProject & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyProjects(userId: string): Promise<{
        project: import("mongoose").Document<unknown, {}, ProjectDocument, {}, {}> & Project & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
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
        _id: Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[]>;
    getUserStats(userId: string): Promise<{
        total: number;
        inProgress: number;
        completed: number;
        submitted: number;
    }>;
}
