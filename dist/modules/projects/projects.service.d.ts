import { Model, Types } from 'mongoose';
import { ProjectDocument, UserProject, UserProjectDocument } from './schemas/project.schema';
export declare class ProjectsService {
    private projectModel;
    private userProjectModel;
    constructor(projectModel: Model<ProjectDocument>, userProjectModel: Model<UserProjectDocument>);
    findAll(difficulty?: string): Promise<any[]>;
    findById(id: string): Promise<any>;
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
    getMyProjects(userId: string): Promise<any[]>;
    getUserStats(userId: string): Promise<{
        total: any;
        inProgress: any;
        completed: any;
        submitted: any;
    }>;
}
