import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(difficulty?: string): Promise<import("./schemas/project.schema").ProjectDocument[]>;
    getMyProjects(userId: string): Promise<{
        project: import("mongoose").Document<unknown, {}, import("./schemas/project.schema").ProjectDocument, {}, {}> & import("./schemas/project.schema").Project & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        userId: import("mongoose").Types.ObjectId;
        projectId: import("mongoose").Types.ObjectId;
        status: string;
        repoUrl: string;
        deployUrl: string;
        mentorFeedback: string;
        score: number;
        startedAt: Date;
        submittedAt: Date;
        reviewedAt: Date;
        _id: import("mongoose").Types.ObjectId;
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
    getMyStats(userId: string): Promise<{
        total: number;
        inProgress: number;
        completed: number;
        submitted: number;
    }>;
    findById(id: string): Promise<import("./schemas/project.schema").ProjectDocument>;
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
