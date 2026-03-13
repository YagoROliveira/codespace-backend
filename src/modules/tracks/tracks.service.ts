import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { UserTrackProgress, UserTrackProgressDocument } from './schemas/user-track-progress.schema';
import { CertificatesService } from '../certificates/certificates.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(UserTrackProgress.name) private progressModel: Model<UserTrackProgressDocument>,
    private readonly certificatesService: CertificatesService,
  ) { }

  async findAll(): Promise<any[]> {
    return this.trackModel.find({ isPublished: true }).sort({ order: 1 }).lean().exec();
  }

  async findById(id: string): Promise<any> {
    const track = await this.trackModel.findById(id).lean().exec();
    if (!track) throw new NotFoundException('Trilha não encontrada');
    return track;
  }

  async getTrackDetail(trackId: string, userId?: string) {
    const track = await this.findById(trackId);
    const trackObj = track;

    let userProgress = null;
    if (userId) {
      const progress = await this.progressModel.findOne({
        userId: new Types.ObjectId(userId),
        trackId: new Types.ObjectId(trackId),
      }).lean().exec();

      if (progress) {
        userProgress = {
          _id: progress._id,
          status: progress.status,
          progressPercent: progress.progressPercent,
          completedLessons: progress.completedLessons,
          lessonProgress: progress.lessonProgress,
          startedAt: progress.startedAt,
          completedAt: progress.completedAt,
        };
      }
    }

    return { ...trackObj, userProgress };
  }

  async getUserTracks(userId: string): Promise<any[]> {
    const tracks = await this.trackModel.find({ isPublished: true }).sort({ order: 1 }).lean().exec();
    const progress = await this.progressModel.find({ userId: new Types.ObjectId(userId) }).lean().exec();

    const progressMap = new Map(
      progress.map((p) => [p.trackId.toString(), p]),
    );

    return tracks.map((track) => {
      const userProgress = progressMap.get((track._id as Types.ObjectId).toString());
      return {
        ...track,
        userProgress: userProgress
          ? {
            status: userProgress.status,
            progressPercent: userProgress.progressPercent,
            completedLessons: userProgress.completedLessons,
            startedAt: userProgress.startedAt,
          }
          : null,
      };
    });
  }

  async startTrack(userId: string, trackId: string): Promise<UserTrackProgressDocument> {
    const track = await this.findById(trackId);

    let progress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      trackId: new Types.ObjectId(trackId),
    }).exec();

    if (!progress) {
      progress = new this.progressModel({
        userId: new Types.ObjectId(userId),
        trackId: new Types.ObjectId(trackId),
        status: 'in_progress',
        startedAt: new Date(),
      });
      await progress.save();
    }

    return progress;
  }

  async completeLesson(
    userId: string,
    trackId: string,
    lessonId: string,
    userName?: string,
  ): Promise<UserTrackProgressDocument> {
    const track = await this.findById(trackId);

    let progress = await this.progressModel.findOne({
      userId: new Types.ObjectId(userId),
      trackId: new Types.ObjectId(trackId),
    }).exec();

    if (!progress) {
      progress = new this.progressModel({
        userId: new Types.ObjectId(userId),
        trackId: new Types.ObjectId(trackId),
        status: 'in_progress',
        startedAt: new Date(),
        lessonProgress: [],
      });
    }

    // Check if lesson already completed
    const existingLesson = progress.lessonProgress.find(
      (lp) => lp.lessonId.toString() === lessonId,
    );

    if (!existingLesson) {
      progress.lessonProgress.push({
        lessonId: new Types.ObjectId(lessonId),
        completed: true,
        completedAt: new Date(),
      });
    }

    progress.completedLessons = progress.lessonProgress.filter((lp) => lp.completed).length;
    const actualTotalLessons = track.lessons?.length || track.totalLessons;
    progress.progressPercent = Math.round(
      (progress.completedLessons / actualTotalLessons) * 100,
    );

    if (progress.completedLessons >= actualTotalLessons) {
      progress.status = 'completed';
      progress.completedAt = new Date();

      // Auto-issue certificate on track completion
      try {
        await this.certificatesService.issueCertificate({
          userId,
          trackId,
          studentName: userName || 'Aluno',
          trackTitle: track.title,
          description: `Conclusão da trilha "${track.title}" - ${track.description || ''}`,
          totalHours: track.estimatedHours || 0,
          totalLessons: actualTotalLessons,
          difficulty: track.difficulty || 'beginner',
        });
      } catch (err) {
        console.error('Erro ao emitir certificado:', err);
      }
    } else {
      progress.status = 'in_progress';
    }

    await progress.save();
    return progress;
  }
}
