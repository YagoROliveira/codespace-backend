import { Document, Types } from 'mongoose';
export declare class Resource extends Document {
    title: string;
    description: string;
    type: string;
    category: string;
    fileUrl: string;
    externalUrl: string;
    thumbnailUrl: string;
    tags: string[];
    requiredPlans: string[];
    downloads: number;
    views: number;
    likes: number;
    isActive: boolean;
    isFeatured: boolean;
    author: string;
    difficulty: string;
    estimatedReadTime: number;
}
export declare const ResourceSchema: import("mongoose").Schema<Resource, import("mongoose").Model<Resource, any, any, any, Document<unknown, any, Resource, any, {}> & Resource & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Resource, Document<unknown, {}, import("mongoose").FlatRecord<Resource>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Resource> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class ResourceBookmark extends Document {
    userId: Types.ObjectId;
    resourceId: Types.ObjectId;
}
export declare const ResourceBookmarkSchema: import("mongoose").Schema<ResourceBookmark, import("mongoose").Model<ResourceBookmark, any, any, any, Document<unknown, any, ResourceBookmark, any, {}> & ResourceBookmark & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ResourceBookmark, Document<unknown, {}, import("mongoose").FlatRecord<ResourceBookmark>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ResourceBookmark> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class ResourceLike extends Document {
    userId: Types.ObjectId;
    resourceId: Types.ObjectId;
}
export declare const ResourceLikeSchema: import("mongoose").Schema<ResourceLike, import("mongoose").Model<ResourceLike, any, any, any, Document<unknown, any, ResourceLike, any, {}> & ResourceLike & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ResourceLike, Document<unknown, {}, import("mongoose").FlatRecord<ResourceLike>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ResourceLike> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
