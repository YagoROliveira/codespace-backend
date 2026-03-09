import { Document, Types } from 'mongoose';
export type JobDocument = Job & Document;
export declare class Job {
    title: string;
    company: string;
    companyLogo: string;
    description: string;
    requirements: string;
    benefits: string;
    type: string;
    location: string;
    level: string;
    salaryRange: string;
    tags: string[];
    requiredSkills: string[];
    applicationUrl: string;
    contactEmail: string;
    isActive: boolean;
    isExclusive: boolean;
    isFeatured: boolean;
    applicationsCount: number;
    expiresAt: Date;
}
export declare const JobSchema: import("mongoose").Schema<Job, import("mongoose").Model<Job, any, any, any, Document<unknown, any, Job, any, {}> & Job & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Job, Document<unknown, {}, import("mongoose").FlatRecord<Job>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Job> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type JobApplicationDocument = JobApplication & Document;
export declare class JobApplication {
    userId: Types.ObjectId;
    jobId: Types.ObjectId;
    status: string;
    coverLetter: string;
    resumeUrl: string;
    appliedAt: Date;
    updatedAt: Date;
}
export declare const JobApplicationSchema: import("mongoose").Schema<JobApplication, import("mongoose").Model<JobApplication, any, any, any, Document<unknown, any, JobApplication, any, {}> & JobApplication & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, JobApplication, Document<unknown, {}, import("mongoose").FlatRecord<JobApplication>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<JobApplication> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
