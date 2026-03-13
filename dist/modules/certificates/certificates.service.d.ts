import { Model, Types } from 'mongoose';
import { CertificateDocument } from './schemas/certificate.schema';
export declare class CertificatesService {
    private certModel;
    constructor(certModel: Model<CertificateDocument>);
    findByUser(userId: string): Promise<any[]>;
    findByCode(code: string): Promise<any>;
    issueCertificate(data: {
        userId: string;
        trackId: string;
        studentName: string;
        trackTitle: string;
        description: string;
        totalHours: number;
        totalLessons: number;
        difficulty: string;
    }): Promise<any>;
    getStats(userId: string): Promise<{
        total: any;
        totalHours: any;
        certificates: (import("mongoose").FlattenMaps<CertificateDocument> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
