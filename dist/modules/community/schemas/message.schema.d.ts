import { Document, Types } from 'mongoose';
export type MessageDocument = Message & Document;
export declare class Message {
    channelId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
    isPinned: boolean;
    likes: Types.ObjectId[];
    replyCount: number;
    parentMessageId: Types.ObjectId;
    attachments: string[];
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message, any, {}> & Message & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Message> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
