"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentTransactionSchema = exports.PaymentTransaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PaymentTransaction = class PaymentTransaction {
};
exports.PaymentTransaction = PaymentTransaction;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PaymentTransaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Subscription' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PaymentTransaction.prototype, "subscriptionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Plan' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PaymentTransaction.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PaymentTransaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'BRL' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['succeeded', 'failed', 'pending', 'refunded', 'cancelled', 'processing'], default: 'pending' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ['credit_card', 'pix', 'boleto', 'debit_card', 'wallet'], default: 'credit_card' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "gatewayTransactionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "gatewayProvider", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "failureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], PaymentTransaction.prototype, "attempt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], PaymentTransaction.prototype, "refundedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PaymentTransaction.prototype, "refundedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], PaymentTransaction.prototype, "invoiceUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], PaymentTransaction.prototype, "metadata", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], PaymentTransaction.prototype, "paidAt", void 0);
exports.PaymentTransaction = PaymentTransaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PaymentTransaction);
exports.PaymentTransactionSchema = mongoose_1.SchemaFactory.createForClass(PaymentTransaction);
exports.PaymentTransactionSchema.index({ userId: 1, createdAt: -1 });
exports.PaymentTransactionSchema.index({ subscriptionId: 1 });
exports.PaymentTransactionSchema.index({ status: 1 });
exports.PaymentTransactionSchema.index({ gatewayTransactionId: 1 });
exports.PaymentTransactionSchema.index({ paidAt: 1 });
exports.PaymentTransactionSchema.index({ planId: 1 });
//# sourceMappingURL=payment-transaction.schema.js.map