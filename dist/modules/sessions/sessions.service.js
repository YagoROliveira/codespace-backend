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
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const session_schema_1 = require("./schemas/session.schema");
let SessionsService = class SessionsService {
    constructor(sessionModel) {
        this.sessionModel = sessionModel;
    }
    async findByUser(userId) {
        return this.sessionModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ scheduledAt: -1 })
            .populate('mentorId', 'name avatar')
            .exec();
    }
    async findUpcoming(userId) {
        return this.sessionModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            scheduledAt: { $gte: new Date() },
            status: { $in: ['scheduled', 'in_progress'] },
        })
            .sort({ scheduledAt: 1 })
            .populate('mentorId', 'name avatar')
            .exec();
    }
    async findPast(userId) {
        return this.sessionModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            $or: [
                { scheduledAt: { $lt: new Date() } },
                { status: 'completed' },
            ],
        })
            .sort({ scheduledAt: -1 })
            .populate('mentorId', 'name avatar')
            .exec();
    }
    async findById(id) {
        const session = await this.sessionModel
            .findById(id)
            .populate('mentorId', 'name avatar')
            .exec();
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return session;
    }
    async create(userId, dto) {
        const session = new this.sessionModel({
            ...dto,
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        return session.save();
    }
    async update(id, dto) {
        const session = await this.sessionModel
            .findByIdAndUpdate(id, { $set: dto }, { new: true })
            .exec();
        if (!session)
            throw new common_1.NotFoundException('Sessão não encontrada');
        return session;
    }
    async cancel(id) {
        return this.update(id, { status: 'cancelled' });
    }
    async getWeekSessions(userId) {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        return this.sessionModel
            .find({
            userId: new mongoose_2.Types.ObjectId(userId),
            scheduledAt: { $gte: startOfWeek, $lt: endOfWeek },
        })
            .sort({ scheduledAt: 1 })
            .populate('mentorId', 'name avatar')
            .exec();
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(session_schema_1.Session.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map