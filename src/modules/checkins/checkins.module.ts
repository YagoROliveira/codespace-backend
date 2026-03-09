import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';
import { Checkin, CheckinSchema } from './schemas/checkin.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Checkin.name, schema: CheckinSchema }])],
  controllers: [CheckinsController],
  providers: [CheckinsService],
  exports: [CheckinsService],
})
export class CheckinsModule { }
