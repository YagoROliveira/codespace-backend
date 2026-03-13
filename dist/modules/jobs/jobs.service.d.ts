import { Model, Types } from 'mongoose';
import { JobDocument, JobApplication, JobApplicationDocument } from './schemas/job.schema';
export declare class JobsService {
    private jobModel;
    private applicationModel;
    constructor(jobModel: Model<JobDocument>, applicationModel: Model<JobApplicationDocument>);
    findAll(filters?: {
        type?: string;
        level?: string;
        tag?: string;
    }): Promise<any[]>;
    findById(id: string): Promise<any>;
    apply(userId: string, jobId: string, coverLetter?: string): Promise<import("mongoose").Document<unknown, {}, JobApplicationDocument, {}, {}> & JobApplication & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyApplications(userId: string): Promise<any[]>;
    getStats(): Promise<{
        total: number;
        exclusive: number;
        remote: number;
    }>;
}
