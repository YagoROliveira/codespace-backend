import { Model } from 'mongoose';
import { ChannelDocument } from './schemas/channel.schema';
import { MessageDocument } from './schemas/message.schema';
import { CreateMessageDto, CreateChannelDto } from './dto/community.dto';
export declare class CommunityService {
    private channelModel;
    private messageModel;
    constructor(channelModel: Model<ChannelDocument>, messageModel: Model<MessageDocument>);
    getChannels(): Promise<any[]>;
    createChannel(dto: CreateChannelDto): Promise<ChannelDocument>;
    getMessages(channelId: string, page?: number, limit?: number): Promise<any>;
    getPinnedMessages(channelId: string): Promise<any[]>;
    createMessage(userId: string, dto: CreateMessageDto): Promise<MessageDocument>;
    toggleLike(messageId: string, userId: string): Promise<MessageDocument>;
    togglePin(messageId: string): Promise<MessageDocument>;
    getReplies(messageId: string): Promise<any[]>;
}
