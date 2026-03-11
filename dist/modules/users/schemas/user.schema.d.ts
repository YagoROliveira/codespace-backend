import { Document, Types } from 'mongoose';
export type UserDocument = User & Document;
export declare class AdminNote {
    _id: Types.ObjectId;
    authorId: Types.ObjectId;
    content: string;
    createdAt: Date;
}
export declare const AdminNoteSchema: import("mongoose").Schema<AdminNote, import("mongoose").Model<AdminNote, any, any, any, Document<unknown, any, AdminNote, any, {}> & AdminNote & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AdminNote, Document<unknown, {}, import("mongoose").FlatRecord<AdminNote>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AdminNote> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
export declare class User {
    name: string;
    email: string;
    password: string;
    avatar: string;
    phone: string;
    bio: string;
    github: string;
    linkedin: string;
    plan: string;
    status: string;
    accountStatus: string;
    subscriptionEndDate: Date;
    role: string;
    mentorId: Types.ObjectId;
    streakDays: number;
    totalHours: number;
    notificationPreferences: {
        email: boolean;
        push: boolean;
        mentorReminders: boolean;
        communityUpdates: boolean;
        weeklyReport: boolean;
    };
    stripeCustomerId: string;
    lastLoginAt: Date;
    adminNotes: AdminNote[];
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
