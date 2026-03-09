import { Document, Types } from 'mongoose';
export type CertificateDocument = Certificate & Document;
export declare class Certificate {
    userId: Types.ObjectId;
    trackId: Types.ObjectId;
    code: string;
    title: string;
    studentName: string;
    trackTitle: string;
    description: string;
    totalHours: number;
    totalLessons: number;
    difficulty: string;
    issuedAt: Date;
    completedAt: Date;
    isValid: boolean;
    verificationUrl: string;
}
export declare const CertificateSchema: import("mongoose").Schema<Certificate, import("mongoose").Model<Certificate, any, any, any, Document<unknown, any, Certificate, any, {}> & Certificate & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Certificate, Document<unknown, {}, import("mongoose").FlatRecord<Certificate>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Certificate> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
