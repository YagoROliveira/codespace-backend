import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserTrackProgress, UserTrackProgressSchema } from '../tracks/schemas/user-track-progress.schema';
import { Session, SessionSchema } from '../sessions/schemas/session.schema';
import { Track, TrackSchema } from '../tracks/schemas/track.schema';
import { StudyCronogram, StudyCronogramSchema } from '../admin/schemas/study-cronogram.schema';
import { Job, JobSchema } from '../jobs/schemas/job.schema';
import { Message, MessageSchema } from '../community/schemas/message.schema';
import { Checkin, CheckinSchema } from '../checkins/schemas/checkin.schema';
import { ScheduleEvent, ScheduleEventSchema } from '../schedules/schemas/schedule-event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserTrackProgress.name, schema: UserTrackProgressSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Track.name, schema: TrackSchema },
      { name: StudyCronogram.name, schema: StudyCronogramSchema },
      { name: Job.name, schema: JobSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Checkin.name, schema: CheckinSchema },
      { name: ScheduleEvent.name, schema: ScheduleEventSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
