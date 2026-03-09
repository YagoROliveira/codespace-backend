import { Model, Types } from 'mongoose';
import { Job, JobDocument, JobApplication, JobApplicationDocument } from './schemas/job.schema';
export declare class JobsService {
    private jobModel;
    private applicationModel;
    constructor(jobModel: Model<JobDocument>, applicationModel: Model<JobApplicationDocument>);
    findAll(filters?: {
        type?: string;
        level?: string;
        tag?: string;
    }): Promise<JobDocument[]>;
    findById(id: string): Promise<JobDocument>;
    apply(userId: string, jobId: string, coverLetter?: string): Promise<import("mongoose").Document<unknown, {}, JobApplicationDocument, {}, {}> & JobApplication & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMyApplications(userId: string): Promise<{
        job: import("mongoose").Document<unknown, {}, JobDocument, {}, {}> & Job & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        };
        userId: Types.ObjectId;
        jobId: Types.ObjectId;
        status: string;
        coverLetter: string;
        resumeUrl: string;
        appliedAt: Date;
        updatedAt: Date;
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
    getStats(): Promise<{
        total: number;
        exclusive: number;
        remote: number;
    }>;
}
