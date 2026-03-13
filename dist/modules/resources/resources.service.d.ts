import { Model, Types } from 'mongoose';
import { Resource } from './schemas/resource.schema';
import { ResourceBookmark } from './schemas/resource.schema';
import { ResourceLike } from './schemas/resource.schema';
export declare class ResourcesService {
    private resourceModel;
    private bookmarkModel;
    private likeModel;
    constructor(resourceModel: Model<Resource>, bookmarkModel: Model<ResourceBookmark>, likeModel: Model<ResourceLike>);
    findAll(type?: string, category?: string, tag?: string): Promise<(import("mongoose").FlattenMaps<Resource> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, Resource, {}, {}> & Resource & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    download(id: string): Promise<{
        url: string;
    }>;
    like(userId: string, id: string): Promise<{
        liked: boolean;
    }>;
    bookmark(userId: string, resourceId: string): Promise<{
        bookmarked: boolean;
    }>;
    getMyBookmarks(userId: string): Promise<(import("mongoose").FlattenMaps<Resource> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getCategories(): Promise<string[]>;
    getStats(): Promise<{
        total: number;
        byType: any;
        totalDownloads: any;
    }>;
}
