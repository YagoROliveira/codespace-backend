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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const plan_schema_1 = require("./schemas/plan.schema");
const subscription_schema_1 = require("./schemas/subscription.schema");
let PlansService = class PlansService {
    constructor(planModel, subscriptionModel) {
        this.planModel = planModel;
        this.subscriptionModel = subscriptionModel;
    }
    async getPlans() {
        return this.planModel.find({ isActive: true }).sort({ order: 1 }).exec();
    }
    async getPlanBySlug(slug) {
        const plan = await this.planModel.findOne({ slug }).exec();
        if (!plan)
            throw new common_1.NotFoundException('Plano não encontrado');
        return plan;
    }
    async getUserSubscription(userId) {
        const subscription = await this.subscriptionModel
            .findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
            status: 'active',
        })
            .populate('planId')
            .sort({ createdAt: -1 })
            .exec();
        return subscription;
    }
    async getInvoices(userId) {
        return this.subscriptionModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('planId', 'name slug')
            .sort({ startDate: -1 })
            .exec();
    }
    async subscribe(userId, planSlug, billingCycle = 'monthly') {
        const plan = await this.getPlanBySlug(planSlug);
        await this.subscriptionModel.updateMany({ userId: new mongoose_2.Types.ObjectId(userId), status: 'active' }, { status: 'cancelled', cancelledAt: new Date() });
        const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + (billingCycle === 'yearly' ? 12 : 1));
        const subscription = new this.subscriptionModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            planId: plan._id,
            status: 'active',
            startDate: new Date(),
            endDate,
            billingCycle,
            amountPaid: amount,
        });
        return subscription.save();
    }
    async cancelSubscription(userId) {
        await this.subscriptionModel.updateMany({ userId: new mongoose_2.Types.ObjectId(userId), status: 'active' }, { status: 'cancelled', cancelledAt: new Date() });
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __param(1, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], PlansService);
//# sourceMappingURL=plans.service.js.map