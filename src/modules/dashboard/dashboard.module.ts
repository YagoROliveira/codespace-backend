import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserTrackProgress, UserTrackProgressSchema } from '../tracks/schemas/user-track-progress.schema';
import { Session, SessionSchema } from '../sessions/schemas/session.schema';
import { Track, TrackSchema } from '../tracks/schemas/track.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserTrackProgress.name, schema: UserTrackProgressSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Track.name, schema: TrackSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
