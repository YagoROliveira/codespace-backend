import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    findAll(type?: string, level?: string, tag?: string): Promise<import("./schemas/job.schema").JobDocument[]>;
    getStats(): Promise<{
        total: number;
        exclusive: number;
        remote: number;
    }>;
    getMyApplications(userId: string): Promise<{
        job: import("mongoose").Document<unknown, {}, import("./schemas/job.schema").JobDocument, {}, {}> & import("./schemas/job.schema").Job & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        userId: import("mongoose").Types.ObjectId;
        jobId: import("mongoose").Types.ObjectId;
        status: string;
        coverLetter: string;
        resumeUrl: string;
        appliedAt: Date;
        updatedAt: Date;
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
    findById(id: string): Promise<import("./schemas/job.schema").JobDocument>;
    apply(userId: string, id: string, body: {
        coverLetter?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/job.schema").JobApplicationDocument, {}, {}> & import("./schemas/job.schema").JobApplication & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
