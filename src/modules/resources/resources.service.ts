import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resource } from './schemas/resource.schema';
import { ResourceBookmark } from './schemas/resource.schema';
import { ResourceLike } from './schemas/resource.schema';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<Resource>,
    @InjectModel(ResourceBookmark.name) private bookmarkModel: Model<ResourceBookmark>,
    @InjectModel(ResourceLike.name) private likeModel: Model<ResourceLike>,
  ) { }

  async findAll(type?: string, category?: string, tag?: string) {
    const filter: any = { isActive: true };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    return this.resourceModel.find(filter).sort({ isFeatured: -1, createdAt: -1 });
  }

  async findById(id: string) {
    const resource = await this.resourceModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!resource) throw new NotFoundException('Recurso não encontrado');
    return resource;
  }

  async download(id: string) {
    const resource = await this.resourceModel.findById(id);
    if (!resource) throw new NotFoundException('Recurso não encontrado');
    await this.resourceModel.findByIdAndUpdate(id, { $inc: { downloads: 1 } });
    return { url: resource.fileUrl || resource.externalUrl };
  }

  async like(userId: string, id: string) {
    const resource = await this.resourceModel.findById(id);
    if (!resource) throw new NotFoundException('Recurso não encontrado');

    try {
      await this.likeModel.create({
        userId: new Types.ObjectId(userId),
        resourceId: new Types.ObjectId(id),
      });
      await this.resourceModel.findByIdAndUpdate(id, { $inc: { likes: 1 } });
      return { liked: true };
    } catch (error: any) {
      if (error.code === 11000) {
        await this.likeModel.deleteOne({
          userId: new Types.ObjectId(userId),
          resourceId: new Types.ObjectId(id),
        });
        await this.resourceModel.findByIdAndUpdate(id, { $inc: { likes: -1 } });
        return { liked: false };
      }
      throw error;
    }
  }

  async bookmark(userId: string, resourceId: string) {
    try {
      await this.bookmarkModel.create({
        userId: new Types.ObjectId(userId),
        resourceId: new Types.ObjectId(resourceId),
      });
      return { bookmarked: true };
    } catch (error: any) {
      if (error.code === 11000) {
        await this.bookmarkModel.deleteOne({
          userId: new Types.ObjectId(userId),
          resourceId: new Types.ObjectId(resourceId),
        });
        return { bookmarked: false };
      }
      throw error;
    }
  }

  async getMyBookmarks(userId: string) {
    const bookmarks = await this.bookmarkModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 });

    const resourceIds = bookmarks.map((b) => b.resourceId);
    return this.resourceModel.find({ _id: { $in: resourceIds } });
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
}
