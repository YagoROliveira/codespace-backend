import { Document, Types } from 'mongoose';
export type ChannelDocument = Channel & Document;
export declare class Channel {
    name: string;
    description: string;
    icon: string;
    order: number;
    isActive: boolean;
}
export declare const ChannelSchema: import("mongoose").Schema<Channel, import("mongoose").Model<Channel, any, any, any, Document<unknown, any, Channel, any, {}> & Channel & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Channel, Document<unknown, {}, import("mongoose").FlatRecord<Channel>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Channel> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
