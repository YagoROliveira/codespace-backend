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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const resource_schema_1 = require("./schemas/resource.schema");
const resource_schema_2 = require("./schemas/resource.schema");
const resource_schema_3 = require("./schemas/resource.schema");
let ResourcesService = class ResourcesService {
    constructor(resourceModel, bookmarkModel, likeModel) {
        this.resourceModel = resourceModel;
        this.bookmarkModel = bookmarkModel;
        this.likeModel = likeModel;
    }
    async findAll(type, category, tag) {
        const filter = { isActive: true };
        if (type)
            filter.type = type;
        if (category)
            filter.category = category;
        if (tag)
            filter.tags = tag;
        return this.resourceModel.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();
    }
    async findById(id) {
        const resource = await this.resourceModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
        if (!resource)
            throw new common_1.NotFoundException('Recurso não encontrado');
        return resource;
    }
    async download(id) {
        const resource = await this.resourceModel.findById(id);
        if (!resource)
            throw new common_1.NotFoundException('Recurso não encontrado');
        await this.resourceModel.findByIdAndUpdate(id, { $inc: { downloads: 1 } });
        return { url: resource.fileUrl || resource.externalUrl };
    }
    async like(userId, id) {
        const resource = await this.resourceModel.findById(id);
        if (!resource)
            throw new common_1.NotFoundException('Recurso não encontrado');
        try {
            await this.likeModel.create({
                userId: new mongoose_2.Types.ObjectId(userId),
                resourceId: new mongoose_2.Types.ObjectId(id),
            });
            await this.resourceModel.findByIdAndUpdate(id, { $inc: { likes: 1 } });
            return { liked: true };
        }
        catch (error) {
            if (error.code === 11000) {
                await this.likeModel.deleteOne({
                    userId: new mongoose_2.Types.ObjectId(userId),
                    resourceId: new mongoose_2.Types.ObjectId(id),
                });
                await this.resourceModel.findByIdAndUpdate(id, { $inc: { likes: -1 } });
                return { liked: false };
            }
            throw error;
        }
    }
    async bookmark(userId, resourceId) {
        try {
            await this.bookmarkModel.create({
                userId: new mongoose_2.Types.ObjectId(userId),
                resourceId: new mongoose_2.Types.ObjectId(resourceId),
            });
            return { bookmarked: true };
        }
        catch (error) {
            if (error.code === 11000) {
                await this.bookmarkModel.deleteOne({
                    userId: new mongoose_2.Types.ObjectId(userId),
                    resourceId: new mongoose_2.Types.ObjectId(resourceId),
                });
                return { bookmarked: false };
            }
            throw error;
        }
    }
    async getMyBookmarks(userId) {
        const bookmarks = await this.bookmarkModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 }).lean();
        const resourceIds = bookmarks.map((b) => b.resourceId);
        return this.resourceModel.find({ _id: { $in: resourceIds } }).lean();
    }
    async getCategories() {
        return this.resourceModel.distinct('category', { isActive: true });
    }
    async getStats() {
        const total = await this.resourceModel.countDocuments({ isActive: true });
        const byType = await this.resourceModel.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$type', count: { $sum: 1 } } },
        ]);
        const totalDownloads = await this.resourceModel.aggregate([
            { $group: { _id: null, total: { $sum: '$downloads' } } },
        ]);
        return {
            total,
            byType: byType.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
            totalDownloads: totalDownloads[0]?.total || 0,
        };
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(resource_schema_1.Resource.name)),
    __param(1, (0, mongoose_1.InjectModel)(resource_schema_2.ResourceBookmark.name)),
    __param(2, (0, mongoose_1.InjectModel)(resource_schema_3.ResourceLike.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map