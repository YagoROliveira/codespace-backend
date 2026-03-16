import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { Track, TrackSchema } from './schemas/track.schema';
import { UserTrackProgress, UserTrackProgressSchema } from './schemas/user-track-progress.schema';
import { StudyCronogram, StudyCronogramSchema } from '../admin/schemas/study-cronogram.schema';
import { CertificatesModule } from '../certificates/certificates.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: UserTrackProgress.name, schema: UserTrackProgressSchema },
      { name: StudyCronogram.name, schema: StudyCronogramSchema },
    ]),
    CertificatesModule,
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule { }
