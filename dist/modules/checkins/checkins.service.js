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
exports.CheckinsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const checkin_schema_1 = require("./schemas/checkin.schema");
let CheckinsService = class CheckinsService {
    constructor(checkinModel) {
        this.checkinModel = checkinModel;
    }
    async create(userId, data) {
        const date = new Date().toISOString().split('T')[0];
        const existing = await this.checkinModel.findOne({ userId: new mongoose_2.Types.ObjectId(userId), date });
        if (existing)
            throw new common_1.ConflictException('Check-in já realizado hoje');
        return this.checkinModel.create({ userId: new mongoose_2.Types.ObjectId(userId), date, ...data });
    }
    async getToday(userId) {
        const date = new Date().toISOString().split('T')[0];
        return this.checkinModel.findOne({ userId: new mongoose_2.Types.ObjectId(userId), date });
    }
    async getHistory(userId, days = 30) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        return this.checkinModel.find({
            userId: new mongoose_2.Types.ObjectId(userId),
            createdAt: { $gte: since },
        }).sort({ date: -1 });
    }
    async getWeeklyReport(userId) {
        const since = new Date();
        since.setDate(since.getDate() - 7);
        const checkins = await this.checkinModel.find({
            userId: new mongoose_2.Types.ObjectId(userId),
            createdAt: { $gte: since },
        });
        return {
            totalDays: checkins.length,
            totalHours: checkins.reduce((s, c) => s + c.hoursStudied, 0),
            avgProductivity: checkins.length ? Math.round(checkins.reduce((s, c) => s + c.productivityScore, 0) / checkins.length) : 0,
            moods: checkins.map(c => ({ date: c.date, mood: c.mood })),
            streak: checkins.length,
        };
    }
    async getStreak(userId) {
        const checkins = await this.checkinModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).sort({ date: -1 }).limit(60);
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 60; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            if (checkins.some(c => c.date === dateStr))
                streak++;
            else
                break;
        }
        return streak;
    }
};
exports.CheckinsService = CheckinsService;
exports.CheckinsService = CheckinsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(checkin_schema_1.Checkin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CheckinsService);
//# sourceMappingURL=checkins.service.js.map