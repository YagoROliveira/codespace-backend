import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private readonly certsService;
    constructor(certsService: CertificatesService);
    getMyCertificates(userId: string): Promise<any[]>;
    getStats(userId: string): Promise<{
        total: any;
        totalHours: any;
        certificates: (import("mongoose").FlattenMaps<import("./schemas/certificate.schema").CertificateDocument> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
    }>;
    verify(code: string): Promise<any>;
}
