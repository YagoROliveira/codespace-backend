"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const user_schema_1 = require("../users/schemas/user.schema");
const track_schema_1 = require("../tracks/schemas/track.schema");
const user_track_progress_schema_1 = require("../tracks/schemas/user-track-progress.schema");
const session_schema_1 = require("../sessions/schemas/session.schema");
const subscription_schema_1 = require("../plans/schemas/subscription.schema");
const plan_schema_1 = require("../plans/schemas/plan.schema");
const code_evaluation_schema_1 = require("./schemas/code-evaluation.schema");
const payment_transaction_schema_1 = require("./schemas/payment-transaction.schema");
const notifications_module_1 = require("../notifications/notifications.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: track_schema_1.Track.name, schema: track_schema_1.TrackSchema },
                { name: user_track_progress_schema_1.UserTrackProgress.name, schema: user_track_progress_schema_1.UserTrackProgressSchema },
                { name: session_schema_1.Session.name, schema: session_schema_1.SessionSchema },
                { name: subscription_schema_1.Subscription.name, schema: subscription_schema_1.SubscriptionSchema },
                { name: plan_schema_1.Plan.name, schema: plan_schema_1.PlanSchema },
                { name: code_evaluation_schema_1.CodeEvaluation.name, schema: code_evaluation_schema_1.CodeEvaluationSchema },
                { name: payment_transaction_schema_1.PaymentTransaction.name, schema: payment_transaction_schema_1.PaymentTransactionSchema },
            ]),
            notifications_module_1.NotificationsModule,
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map