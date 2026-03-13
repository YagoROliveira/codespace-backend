import { JobsService } from './jobs.service';
export declare class JobsController {
    private readonly jobsService;
    constructor(jobsService: JobsService);
    findAll(type?: string, level?: string, tag?: string): Promise<any[]>;
    getStats(): Promise<{
        total: number;
        exclusive: number;
        remote: number;
    }>;
    getMyApplications(userId: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    apply(userId: string, id: string, body: {
        coverLetter?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/job.schema").JobApplicationDocument, {}, {}> & import("./schemas/job.schema").JobApplication & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
