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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLikeSchema = exports.ResourceLike = exports.ResourceBookmarkSchema = exports.ResourceBookmark = exports.ResourceSchema = exports.Resource = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Resource = class Resource extends mongoose_2.Document {
};
exports.Resource = Resource;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Resource.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Resource.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['ebook', 'cheatsheet', 'video', 'article', 'template', 'tool'] }),
    __metadata("design:type", String)
], Resource.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Resource.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Resource.prototype, "fileUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Resource.prototype, "externalUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Resource.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Resource.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Resource.prototype, "requiredPlans", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Resource.prototype, "downloads", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Resource.prototype, "views", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Resource.prototype, "likes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Resource.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Resource.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Resource.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Resource.prototype, "difficulty", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Resource.prototype, "estimatedReadTime", void 0);
exports.Resource = Resource = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Resource);
exports.ResourceSchema = mongoose_1.SchemaFactory.createForClass(Resource);
exports.ResourceSchema.index({ type: 1, category: 1 });
exports.ResourceSchema.index({ tags: 1 });
let ResourceBookmark = class ResourceBookmark extends mongoose_2.Document {
};
exports.ResourceBookmark = ResourceBookmark;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ResourceBookmark.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Resource', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ResourceBookmark.prototype, "resourceId", void 0);
exports.ResourceBookmark = ResourceBookmark = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ResourceBookmark);
exports.ResourceBookmarkSchema = mongoose_1.SchemaFactory.createForClass(ResourceBookmark);
exports.ResourceBookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true });
let ResourceLike = class ResourceLike extends mongoose_2.Document {
};
exports.ResourceLike = ResourceLike;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ResourceLike.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Resource', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ResourceLike.prototype, "resourceId", void 0);
exports.ResourceLike = ResourceLike = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ResourceLike);
exports.ResourceLikeSchema = mongoose_1.SchemaFactory.createForClass(ResourceLike);
exports.ResourceLikeSchema.index({ userId: 1, resourceId: 1 }, { unique: true });
//# sourceMappingURL=resource.schema.js.map