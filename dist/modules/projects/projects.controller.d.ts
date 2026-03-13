import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(difficulty?: string): Promise<any[]>;
    getMyProjects(userId: string): Promise<any[]>;
    getMyStats(userId: string): Promise<{
        total: any;
        inProgress: any;
        completed: any;
        submitted: any;
    }>;
    findById(id: string): Promise<any>;
    startProject(userId: string, id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").UserProjectDocument, {}, {}> & import("./schemas/project.schema").UserProject & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    submitProject(userId: string, id: string, body: {
        repoUrl: string;
        deployUrl?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/project.schema").UserProjectDocument, {}, {}> & import("./schemas/project.schema").UserProject & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
