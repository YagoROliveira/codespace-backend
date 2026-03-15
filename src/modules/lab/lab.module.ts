import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabController } from './lab.controller';
import { LabService } from './lab.service';
import { LabEnvironment, LabEnvironmentSchema } from './schemas/lab-environment.schema';
import { LabExercise, LabExerciseSchema } from './schemas/lab-exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LabEnvironment.name, schema: LabEnvironmentSchema },
      { name: LabExercise.name, schema: LabExerciseSchema },
    ]),
  ],
  controllers: [LabController],
  providers: [LabService],
  exports: [LabService],
})
export class LabModule { }
