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

  async findByUser(userId: string): Promise<CertificateDocument[]> {
    return this.certModel.find({ userId: new Types.ObjectId(userId), isValid: true }).sort({ issuedAt: -1 });
  }

  async findByCode(code: string): Promise<CertificateDocument> {
    const cert = await this.certModel.findOne({ code });
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
  }): Promise<CertificateDocument> {
    const existing = await this.certModel.findOne({
      userId: new Types.ObjectId(data.userId),
      trackId: new Types.ObjectId(data.trackId),
    });
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
    const certs = await this.certModel.find({ userId: new Types.ObjectId(userId), isValid: true });
    return {
      total: certs.length,
      totalHours: certs.reduce((sum, c) => sum + c.totalHours, 0),
      certificates: certs,
    };
  }
}
