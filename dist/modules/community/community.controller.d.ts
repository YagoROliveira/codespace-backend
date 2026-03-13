import { CommunityService } from './community.service';
import { CreateMessageDto, CreateChannelDto } from './dto/community.dto';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
    getChannels(): Promise<any[]>;
    createChannel(dto: CreateChannelDto): Promise<import("./schemas/channel.schema").ChannelDocument>;
    getMessages(channelId: string, page?: string, limit?: string): Promise<any>;
    getPinnedMessages(channelId: string): Promise<any[]>;
    createMessage(userId: string, dto: CreateMessageDto): Promise<import("./schemas/message.schema").MessageDocument>;
    toggleLike(id: string, userId: string): Promise<import("./schemas/message.schema").MessageDocument>;
    togglePin(id: string): Promise<import("./schemas/message.schema").MessageDocument>;
    getReplies(id: string): Promise<any[]>;
}
