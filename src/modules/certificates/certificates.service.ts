import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Certificate, CertificateDocument } from './schemas/certificate.schema';
import { randomUUID } from 'crypto';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name) private certModel: Model<CertificateDocument>,
  ) { }

  async findByUser(userId: string): Promise<any[]> {
    return this.certModel.find({ userId: new Types.ObjectId(userId), isValid: true }).sort({ issuedAt: -1 }).lean();
  }

  async findByCode(code: string): Promise<any> {
    const cert = await this.certModel.findOne({ code }).lean();
    if (!cert) throw new NotFoundException('Certificado não encontrado');
    return cert;
  }

  async issueCertificate(data: {
    userId: string;
    trackId: string;
    studentName: string;
    trackTitle: string;
    description: string;
    totalHours: number;
    totalLessons: number;
    difficulty: string;
  }): Promise<any> {
    const existing = await this.certModel.findOne({
      userId: new Types.ObjectId(data.userId),
      trackId: new Types.ObjectId(data.trackId),
    }).lean();
    if (existing) return existing;

    const code = `CS-${randomUUID().slice(0, 8).toUpperCase()}`;
    return this.certModel.create({
      userId: new Types.ObjectId(data.userId),
      trackId: new Types.ObjectId(data.trackId),
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

  async getStats(userId: string) {
    const [statsAgg, certs] = await Promise.all([
      this.certModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId), isValid: true } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            totalHours: { $sum: '$totalHours' },
          },
        },
      ]),
      this.certModel.find({ userId: new Types.ObjectId(userId), isValid: true }).lean(),
    ]);

    const s = statsAgg[0] || { total: 0, totalHours: 0 };
    return {
      total: s.total,
      totalHours: s.totalHours,
      certificates: certs,
    };
  }
}
