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
exports.CommunityController = void 0;
const common_1 = require("@nestjs/common");
const community_service_1 = require("./community.service");
const community_dto_1 = require("./dto/community.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let CommunityController = class CommunityController {
    constructor(communityService) {
        this.communityService = communityService;
    }
    async getChannels() {
        return this.communityService.getChannels();
    }
    async createChannel(dto) {
        return this.communityService.createChannel(dto);
    }
    async getMessages(channelId, page, limit) {
        return this.communityService.getMessages(channelId, page ? parseInt(page) : 1, limit ? parseInt(limit) : 50);
    }
    async getPinnedMessages(channelId) {
        return this.communityService.getPinnedMessages(channelId);
    }
    async createMessage(userId, dto) {
        return this.communityService.createMessage(userId, dto);
    }
    async toggleLike(id, userId) {
        return this.communityService.toggleLike(id, userId);
    }
    async togglePin(id) {
        return this.communityService.togglePin(id);
    }
    async getReplies(id) {
        return this.communityService.getReplies(id);
    }
};
exports.CommunityController = CommunityController;
__decorate([
    (0, common_1.Get)('channels'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getChannels", null);
__decorate([
    (0, common_1.Post)('channels'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [community_dto_1.CreateChannelDto]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createChannel", null);
__decorate([
    (0, common_1.Get)('channels/:channelId/messages'),
    __param(0, (0, common_1.Param)('channelId')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Get)('channels/:channelId/pinned'),
    __param(0, (0, common_1.Param)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getPinnedMessages", null);
__decorate([
    (0, common_1.Post)('messages'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, community_dto_1.CreateMessageDto]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "createMessage", null);
__decorate([
    (0, common_1.Put)('messages/:id/like'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Put)('messages/:id/pin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "togglePin", null);
__decorate([
    (0, common_1.Get)('messages/:id/replies'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "getReplies", null);
exports.CommunityController = CommunityController = __decorate([
    (0, common_1.Controller)('community'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [community_service_1.CommunityService])
], CommunityController);
//# sourceMappingURL=community.controller.js.map