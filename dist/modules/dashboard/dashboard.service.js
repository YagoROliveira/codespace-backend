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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const user_track_progress_schema_1 = require("../tracks/schemas/user-track-progress.schema");
const session_schema_1 = require("../sessions/schemas/session.schema");
const track_schema_1 = require("../tracks/schemas/track.schema");
const study_cronogram_schema_1 = require("../admin/schemas/study-cronogram.schema");
const job_schema_1 = require("../jobs/schemas/job.schema");
const message_schema_1 = require("../community/schemas/message.schema");
const checkin_schema_1 = require("../checkins/schemas/checkin.schema");
let DashboardService = class DashboardService {
    constructor(userModel, progressModel, sessionModel, trackModel, cronogramModel, jobModel, messageModel, checkinModel) {
        this.userModel = userModel;
        this.progressModel = progressModel;
        this.sessionModel = sessionModel;
        this.trackModel = trackModel;
        this.cronogramModel = cronogramModel;
        this.jobModel = jobModel;
        this.messageModel = messageModel;
        this.checkinModel = checkinModel;
    }
    async getDashboard(userId) {
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
        const [user, activeTracks, upcomingSessions, totalSessions, completedTracks, cronogram, recentJobs, jobsCount, recentMessages, todayCheckin, weekCheckins,] = await Promise.all([
            this.userModel.findById(userId).lean().exec(),
            this.progressModel
                .find({ userId: userObjectId, status: 'in_progress' })
                .populate('trackId')
                .lean().exec(),
            this.sessionModel
                .find({
                userId: userObjectId,
                scheduledAt: { $gte: now },
                status: 'scheduled',
            })
                .sort({ scheduledAt: 1 })
                .limit(3)
                .populate('mentorId', 'name avatar')
                .lean().exec(),
            this.sessionModel.countDocuments({
                userId: userObjectId,
                status: 'completed',
            }),
            this.progressModel.countDocuments({
                userId: userObjectId,
                status: 'completed',
            }),
            this.cronogramModel.findOne({
                userId: userObjectId,
                status: { $in: ['active', 'draft'] },
            }).lean().exec(),
            this.jobModel.find({ isActive: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean().exec(),
            this.jobModel.countDocuments({ isActive: true }),
            this.messageModel.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('userId', 'name avatar role')
                .populate('channelId', 'name icon')
                .lean().exec(),
            this.checkinModel.findOne({
                userId: userObjectId,
                date: todayStart.toISOString().split('T')[0],
            }).lean().exec(),
            this.checkinModel.find({
                userId: userObjectId,
                createdAt: { $gte: new Date(now.getTime() - 7 * 86400000) },
            }).sort({ createdAt: -1 }).lean().exec(),
        ]);
        const inProgressTracks = activeTracks.map((progress) => ({
            track: progress.trackId,
            progressPercent: progress.progressPercent,
            completedLessons: progress.completedLessons,
            startedAt: progress.startedAt,
        }));
        let todayPlan = [];
        let cronogramSummary = null;
        let nextLesson = null;
        if (cronogram) {
            const todayStr = todayStart.toISOString().split('T')[0];
            todayPlan = (cronogram.dailyPlan || [])
                .filter(item => {
                const itemDate = new Date(item.date).toISOString().split('T')[0];
                return itemDate === todayStr;
            })
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            const progressMap = new Map();
            for (const tp of activeTracks) {
                const trackId = tp.trackId?._id?.toString() || tp.trackId?.toString();
                const completed = new Set((tp.lessonProgress || [])
                    .filter(lp => lp.completed)
                    .map(lp => lp.lessonId.toString()));
                if (trackId)
                    progressMap.set(trackId, completed);
            }
            todayPlan = todayPlan.map(item => {
                const tId = item.trackId?.toString();
                const lId = item.lessonId?.toString();
                const completedSet = tId ? progressMap.get(tId) : null;
                const isCompleted = item.completed || (completedSet && lId ? completedSet.has(lId) : false);
                return { ...item, completed: isCompleted };
            });
            const totalItems = (cronogram.dailyPlan || []).length;
            const completedItems = (cronogram.dailyPlan || []).filter(i => i.completed).length;
            cronogramSummary = {
                name: cronogram.name,
                overallProgress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
                totalItems,
                completedItems,
                dailyStudyHours: cronogram.dailyStudyHours,
                weeklyStudyDays: cronogram.weeklyStudyDays,
                tracksCount: cronogram.tracks?.length || 0,
            };
            const allPlan = (cronogram.dailyPlan || [])
                .filter(item => {
                const d = new Date(item.date).toISOString().split('T')[0];
                return d >= todayStr && !item.completed;
            })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || (a.order || 0) - (b.order || 0));
            if (allPlan.length > 0) {
                const next = allPlan[0];
                nextLesson = {
                    trackId: next.trackId,
                    lessonId: next.lessonId,
                    title: next.title,
                    estimatedMinutes: next.estimatedMinutes,
                };
            }
        }
        if (!nextLesson && activeTracks.length > 0) {
            const first = activeTracks[0];
            const track = first.trackId;
            if (track?.lessons?.length) {
                const completedIds = new Set((first.lessonProgress || []).filter(lp => lp.completed).map(lp => lp.lessonId.toString()));
                const nextL = track.lessons.find((l) => !completedIds.has(l._id.toString()));
                if (nextL) {
                    nextLesson = {
                        trackId: track._id,
                        lessonId: nextL._id,
                        title: nextL.title,
                        estimatedMinutes: nextL.durationMinutes,
                    };
                }
            }
        }
        const weeklyStudyHours = weekCheckins.reduce((sum, c) => sum + (c.hoursStudied || 0), 0);
        const avgProductivity = weekCheckins.length > 0
            ? Math.round(weekCheckins.reduce((sum, c) => sum + (c.productivityScore || 0), 0) / weekCheckins.length)
            : 0;
        return {
            user: {
                name: user?.name,
                avatar: user?.avatar,
                plan: user?.plan,
                streakDays: user?.streakDays || 0,
                totalHours: user?.totalHours || 0,
            },
            stats: {
                activeTracks: activeTracks.length,
                completedTracks,
                totalHours: user?.totalHours || 0,
                totalSessions,
                streakDays: user?.streakDays || 0,
                totalLessonsCompleted: activeTracks.reduce((sum, tp) => sum + (tp.completedLessons || 0), 0),
            },
            activeTracks: inProgressTracks,
            upcomingSessions,
            cronogram: cronogramSummary,
            todayPlan,
            nextLesson,
            recentJobs: recentJobs.map(j => ({
                _id: j._id,
                title: j.title,
                company: j.company,
                companyLogo: j.companyLogo,
                type: j.type,
                level: j.level,
                location: j.location,
                salaryRange: j.salaryRange,
                tags: j.tags?.slice(0, 3),
                isFeatured: j.isFeatured,
                isExclusive: j.isExclusive,
            })),
            jobsTotal: jobsCount,
            recentCommunity: recentMessages.map(m => ({
                _id: m._id,
                content: m.content?.substring(0, 120),
                user: m.userId,
                channel: m.channelId,
                createdAt: m.createdAt,
            })),
            todayCheckin: todayCheckin ? {
                mood: todayCheckin.mood,
                hoursStudied: todayCheckin.hoursStudied,
                productivityScore: todayCheckin.productivityScore,
            } : null,
            weeklyStudy: {
                totalHours: weeklyStudyHours,
                avgProductivity,
                checkinsDone: weekCheckins.length,
            },
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_track_progress_schema_1.UserTrackProgress.name)),
    __param(2, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __param(3, (0, mongoose_1.InjectModel)(track_schema_1.Track.name)),
    __param(4, (0, mongoose_1.InjectModel)(study_cronogram_schema_1.StudyCronogram.name)),
    __param(5, (0, mongoose_1.InjectModel)(job_schema_1.Job.name)),
    __param(6, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __param(7, (0, mongoose_1.InjectModel)(checkin_schema_1.Checkin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map