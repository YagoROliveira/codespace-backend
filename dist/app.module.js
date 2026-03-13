"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const tracks_module_1 = require("./modules/tracks/tracks.module");
const sessions_module_1 = require("./modules/sessions/sessions.module");
const community_module_1 = require("./modules/community/community.module");
const plans_module_1 = require("./modules/plans/plans.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const admin_module_1 = require("./modules/admin/admin.module");
const certificates_module_1 = require("./modules/certificates/certificates.module");
const challenges_module_1 = require("./modules/challenges/challenges.module");
const jobs_module_1 = require("./modules/jobs/jobs.module");
const interviews_module_1 = require("./modules/interviews/interviews.module");
const checkins_module_1 = require("./modules/checkins/checkins.module");
const projects_module_1 = require("./modules/projects/projects.module");
const resources_module_1 = require("./modules/resources/resources.module");
const payments_module_1 = require("./modules/payments/payments.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const google_calendar_module_1 = require("./modules/google-calendar/google-calendar.module");
const workspaces_module_1 = require("./modules/workspaces/workspaces.module");
const ide_module_1 = require("./modules/ide/ide.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env${process.env.NODE_ENV === 'production' ? '.production' : ''}`,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    uri: configService.get('MONGODB_URI'),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tracks_module_1.TracksModule,
            sessions_module_1.SessionsModule,
            community_module_1.CommunityModule,
            plans_module_1.PlansModule,
            dashboard_module_1.DashboardModule,
            admin_module_1.AdminModule,
            certificates_module_1.CertificatesModule,
            challenges_module_1.ChallengesModule,
            jobs_module_1.JobsModule,
            interviews_module_1.InterviewsModule,
            checkins_module_1.CheckinsModule,
            projects_module_1.ProjectsModule,
            resources_module_1.ResourcesModule,
            payments_module_1.PaymentsModule,
            notifications_module_1.NotificationsModule,
            google_calendar_module_1.GoogleCalendarModule,
            workspaces_module_1.WorkspacesModule,
            ide_module_1.IdeModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map