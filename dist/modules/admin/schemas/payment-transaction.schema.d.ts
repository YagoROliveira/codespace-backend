import { Document, Types } from 'mongoose';
export type PaymentTransactionDocument = PaymentTransaction & Document;
export declare class PaymentTransaction {
    userId: Types.ObjectId;
    subscriptionId: Types.ObjectId;
    planId: Types.ObjectId;
    amount: number;
    currency: string;
    status: string;
    paymentMethod: string;
    gatewayTransactionId: string;
    gatewayProvider: string;
    description: string;
    failureReason: string;
    attempt: number;
    refundedAmount: number;
    refundedAt: Date;
    invoiceUrl: string;
    metadata: Record<string, unknown>;
    paidAt: Date;
}
export declare const PaymentTransactionSchema: import("mongoose").Schema<PaymentTransaction, import("mongoose").Model<PaymentTransaction, any, any, any, Document<unknown, any, PaymentTransaction, any, {}> & PaymentTransaction & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PaymentTransaction, Document<unknown, {}, import("mongoose").FlatRecord<PaymentTransaction>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<PaymentTransaction> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
