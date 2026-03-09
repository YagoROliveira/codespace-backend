import { Document, Types } from 'mongoose';
export type SubscriptionDocument = Subscription & Document;
export declare class Subscription {
    userId: Types.ObjectId;
    planId: Types.ObjectId;
    status: string;
    startDate: Date;
    endDate: Date;
    cancelledAt: Date;
    billingCycle: string;
    amountPaid: number;
    paymentMethod: string;
    stripePaymentIntentId: string;
    stripeCustomerId: string;
    stripePaymentMethodType: string;
    receiptUrl: string;
}
export declare const SubscriptionSchema: import("mongoose").Schema<Subscription, import("mongoose").Model<Subscription, any, any, any, Document<unknown, any, Subscription, any, {}> & Subscription & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Subscription, Document<unknown, {}, import("mongoose").FlatRecord<Subscription>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Subscription> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
