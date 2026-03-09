export declare class CreateMessageDto {
    channelId: string;
    content: string;
    parentMessageId?: string;
}
export declare class CreateChannelDto {
    name: string;
    description?: string;
    icon?: string;
}
