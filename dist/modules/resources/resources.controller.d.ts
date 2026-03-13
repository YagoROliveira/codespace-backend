import { ResourcesService } from './resources.service';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    findAll(type?: string, category?: string, tag?: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/resource.schema").Resource> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getCategories(): Promise<string[]>;
    getStats(): Promise<{
        total: number;
        byType: any;
        totalDownloads: any;
    }>;
    getMyBookmarks(userId: string): Promise<(import("mongoose").FlattenMaps<import("./schemas/resource.schema").Resource> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/resource.schema").Resource, {}, {}> & import("./schemas/resource.schema").Resource & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    download(id: string): Promise<{
        url: string;
    }>;
    like(userId: string, id: string): Promise<{
        liked: boolean;
    }>;
    bookmark(userId: string, id: string): Promise<{
        bookmarked: boolean;
    }>;
}
