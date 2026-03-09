import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { CommunityModule } from './modules/community/community.module';
import { PlansModule } from './modules/plans/plans.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AdminModule } from './modules/admin/admin.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { InterviewsModule } from './modules/interviews/interviews.module';
import { CheckinsModule } from './modules/checkins/checkins.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV === 'production' ? '.production' : ''}`,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TracksModule,
    SessionsModule,
    CommunityModule,
    PlansModule,
    DashboardModule,
    AdminModule,
    CertificatesModule,
    ChallengesModule,
    JobsModule,
    InterviewsModule,
    CheckinsModule,
    ProjectsModule,
    ResourcesModule,
    PaymentsModule,
  ],
})
export class AppModule { }
