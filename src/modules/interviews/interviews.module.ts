import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { InterviewQuestion, InterviewQuestionSchema, InterviewSession, InterviewSessionSchema } from './schemas/interview.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InterviewQuestion.name, schema: InterviewQuestionSchema },
      { name: InterviewSession.name, schema: InterviewSessionSchema },
    ]),
  ],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule { }
