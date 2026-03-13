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
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const channel_schema_1 = require("./schemas/channel.schema");
const message_schema_1 = require("./schemas/message.schema");
let CommunityService = class CommunityService {
    constructor(channelModel, messageModel) {
        this.channelModel = channelModel;
        this.messageModel = messageModel;
    }
    async getChannels() {
        return this.channelModel.find({ isActive: true }).sort({ order: 1 }).lean().exec();
    }
    async createChannel(dto) {
        const channel = new this.channelModel(dto);
        return channel.save();
    }
    async getMessages(channelId, page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        const [messages, total] = await Promise.all([
            this.messageModel
                .find({
                channelId: new mongoose_2.Types.ObjectId(channelId),
                parentMessageId: null,
            })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'name avatar role plan')
                .lean().exec(),
            this.messageModel.countDocuments({
                channelId: new mongoose_2.Types.ObjectId(channelId),
                parentMessageId: null,
            }),
        ]);
        return {
            messages: messages.reverse(),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getPinnedMessages(channelId) {
        return this.messageModel
            .find({
            channelId: new mongoose_2.Types.ObjectId(channelId),
            isPinned: true,
        })
            .populate('userId', 'name avatar role')
            .sort({ createdAt: -1 })
            .lean().exec();
    }
    async createMessage(userId, dto) {
        const message = new this.messageModel({
            ...dto,
            userId: new mongoose_2.Types.ObjectId(userId),
            channelId: new mongoose_2.Types.ObjectId(dto.channelId),
            parentMessageId: dto.parentMessageId
                ? new mongoose_2.Types.ObjectId(dto.parentMessageId)
                : null,
        });
        const saved = await message.save();
        if (dto.parentMessageId) {
            await this.messageModel.findByIdAndUpdate(dto.parentMessageId, {
                $inc: { replyCount: 1 },
            });
        }
        return saved.populate('userId', 'name avatar role plan');
    }
    async toggleLike(messageId, userId) {
        const message = await this.messageModel.findById(messageId).exec();
        if (!message)
            throw new common_1.NotFoundException('Mensagem não encontrada');
        const userObjectId = new mongoose_2.Types.ObjectId(userId);
        const likeIndex = message.likes.findIndex((id) => id.toString() === userId);
        if (likeIndex > -1) {
            message.likes.splice(likeIndex, 1);
        }
        else {
            message.likes.push(userObjectId);
        }
        await message.save();
        return message.populate('userId', 'name avatar role plan');
    }
    async togglePin(messageId) {
        const message = await this.messageModel.findById(messageId).exec();
        if (!message)
            throw new common_1.NotFoundException('Mensagem não encontrada');
        message.isPinned = !message.isPinned;
        await message.save();
        return message;
    }
    async getReplies(messageId) {
        return this.messageModel
            .find({ parentMessageId: new mongoose_2.Types.ObjectId(messageId) })
            .populate('userId', 'name avatar role plan')
            .sort({ createdAt: 1 })
            .lean().exec();
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(channel_schema_1.Channel.name)),
    __param(1, (0, mongoose_1.InjectModel)(message_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CommunityService);
//# sourceMappingURL=community.service.js.map