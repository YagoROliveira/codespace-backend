import { Model, Types } from 'mongoose';
import { Certificate, CertificateDocument } from './schemas/certificate.schema';
export declare class CertificatesService {
    private certModel;
    constructor(certModel: Model<CertificateDocument>);
    findByUser(userId: string): Promise<CertificateDocument[]>;
    findByCode(code: string): Promise<CertificateDocument>;
    issueCertificate(data: {
        userId: string;
        trackId: string;
        studentName: string;
        trackTitle: string;
        description: string;
        totalHours: number;
        totalLessons: number;
        difficulty: string;
    }): Promise<CertificateDocument>;
    getStats(userId: string): Promise<{
        total: number;
        totalHours: number;
        certificates: (import("mongoose").Document<unknown, {}, CertificateDocument, {}, {}> & Certificate & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
}
