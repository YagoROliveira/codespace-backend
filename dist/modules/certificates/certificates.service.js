"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const certificate_schema_1 = require("./schemas/certificate.schema");
const crypto_1 = require("crypto");
let CertificatesService = class CertificatesService {
    constructor(certModel) {
        this.certModel = certModel;
    }
    async findByUser(userId) {
        return this.certModel.find({ userId: new mongoose_2.Types.ObjectId(userId), isValid: true }).sort({ issuedAt: -1 }).lean();
    }
    async findByCode(code) {
        const cert = await this.certModel.findOne({ code }).lean();
        if (!cert)
            throw new common_1.NotFoundException('Certificado não encontrado');
        return cert;
    }
    async issueCertificate(data) {
        const existing = await this.certModel.findOne({
            userId: new mongoose_2.Types.ObjectId(data.userId),
            trackId: new mongoose_2.Types.ObjectId(data.trackId),
        }).lean();
        if (existing)
            return existing;
        const code = `CS-${(0, crypto_1.randomUUID)().slice(0, 8).toUpperCase()}`;
        return this.certModel.create({
            userId: new mongoose_2.Types.ObjectId(data.userId),
            trackId: new mongoose_2.Types.ObjectId(data.trackId),
            code,
            title: `Certificado: ${data.trackTitle}`,
            studentName: data.studentName,
            trackTitle: data.trackTitle,
            description: data.description,
            totalHours: data.totalHours,
            totalLessons: data.totalLessons,
            difficulty: data.difficulty,
            issuedAt: new Date(),
            completedAt: new Date(),
            isValid: true,
            verificationUrl: `/certificates/verify/${code}`,
        });
    }
    async getStats(userId) {
        const [statsAgg, certs] = await Promise.all([
            this.certModel.aggregate([
                { $match: { userId: new mongoose_2.Types.ObjectId(userId), isValid: true } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        totalHours: { $sum: '$totalHours' },
                    },
                },
            ]),
            this.certModel.find({ userId: new mongoose_2.Types.ObjectId(userId), isValid: true }).lean(),
        ]);
        const s = statsAgg[0] || { total: 0, totalHours: 0 };
        return {
            total: s.total,
            totalHours: s.totalHours,
            certificates: certs,
        };
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(certificate_schema_1.Certificate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map