import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private readonly certsService;
    constructor(certsService: CertificatesService);
    getMyCertificates(userId: string): Promise<import("./schemas/certificate.schema").CertificateDocument[]>;
    getStats(userId: string): Promise<{
        total: number;
        totalHours: number;
        certificates: (import("mongoose").Document<unknown, {}, import("./schemas/certificate.schema").CertificateDocument, {}, {}> & import("./schemas/certificate.schema").Certificate & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    verify(code: string): Promise<import("./schemas/certificate.schema").CertificateDocument>;
}
