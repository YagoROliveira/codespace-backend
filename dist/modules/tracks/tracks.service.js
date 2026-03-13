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
exports.TracksService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const track_schema_1 = require("./schemas/track.schema");
const user_track_progress_schema_1 = require("./schemas/user-track-progress.schema");
const certificates_service_1 = require("../certificates/certificates.service");
let TracksService = class TracksService {
    constructor(trackModel, progressModel, certificatesService) {
        this.trackModel = trackModel;
        this.progressModel = progressModel;
        this.certificatesService = certificatesService;
    }
    async findAll() {
        return this.trackModel.find({ isPublished: true }).sort({ order: 1 }).lean().exec();
    }
    async findById(id) {
        const track = await this.trackModel.findById(id).lean().exec();
        if (!track)
            throw new common_1.NotFoundException('Trilha não encontrada');
        return track;
    }
    async getTrackDetail(trackId, userId) {
        const track = await this.findById(trackId);
        const trackObj = track;
        let userProgress = null;
        if (userId) {
            const progress = await this.progressModel.findOne({
                userId: new mongoose_2.Types.ObjectId(userId),
                trackId: new mongoose_2.Types.ObjectId(trackId),
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
    async getUserTracks(userId) {
        const tracks = await this.trackModel.find({ isPublished: true }).sort({ order: 1 }).lean().exec();
        const progress = await this.progressModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).lean().exec();
        const progressMap = new Map(progress.map((p) => [p.trackId.toString(), p]));
        return tracks.map((track) => {
            const userProgress = progressMap.get(track._id.toString());
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
    async startTrack(userId, trackId) {
        const track = await this.findById(trackId);
        let progress = await this.progressModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            trackId: new mongoose_2.Types.ObjectId(trackId),
        }).exec();
        if (!progress) {
            progress = new this.progressModel({
                userId: new mongoose_2.Types.ObjectId(userId),
                trackId: new mongoose_2.Types.ObjectId(trackId),
                status: 'in_progress',
                startedAt: new Date(),
            });
            await progress.save();
        }
        return progress;
    }
    async completeLesson(userId, trackId, lessonId, userName) {
        const track = await this.findById(trackId);
        let progress = await this.progressModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            trackId: new mongoose_2.Types.ObjectId(trackId),
        }).exec();
        if (!progress) {
            progress = new this.progressModel({
                userId: new mongoose_2.Types.ObjectId(userId),
                trackId: new mongoose_2.Types.ObjectId(trackId),
                status: 'in_progress',
                startedAt: new Date(),
                lessonProgress: [],
            });
        }
        const existingLesson = progress.lessonProgress.find((lp) => lp.lessonId.toString() === lessonId);
        if (!existingLesson) {
            progress.lessonProgress.push({
                lessonId: new mongoose_2.Types.ObjectId(lessonId),
                completed: true,
                completedAt: new Date(),
            });
        }
        progress.completedLessons = progress.lessonProgress.filter((lp) => lp.completed).length;
        const actualTotalLessons = track.lessons?.length || track.totalLessons;
        progress.progressPercent = Math.round((progress.completedLessons / actualTotalLessons) * 100);
        if (progress.completedLessons >= actualTotalLessons) {
            progress.status = 'completed';
            progress.completedAt = new Date();
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
            }
            catch (err) {
                console.error('Erro ao emitir certificado:', err);
            }
        }
        else {
            progress.status = 'in_progress';
        }
        await progress.save();
        return progress;
    }
};
exports.TracksService = TracksService;
exports.TracksService = TracksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_track_progress_schema_1.UserTrackProgress.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        certificates_service_1.CertificatesService])
], TracksService);
//# sourceMappingURL=tracks.service.js.map