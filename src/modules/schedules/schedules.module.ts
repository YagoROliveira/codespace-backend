import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { ScheduleTemplate, ScheduleTemplateSchema } from './schemas/schedule-template.schema';
import { StudentSchedule, StudentScheduleSchema } from './schemas/student-schedule.schema';
import { ScheduleEvent, ScheduleEventSchema } from './schemas/schedule-event.schema';
import { Plan, PlanSchema } from '../plans/schemas/plan.schema';
import { Subscription, SubscriptionSchema } from '../plans/schemas/subscription.schema';
import { Session, SessionSchema } from '../sessions/schemas/session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScheduleTemplate.name, schema: ScheduleTemplateSchema },
      { name: StudentSchedule.name, schema: StudentScheduleSchema },
      { name: ScheduleEvent.name, schema: ScheduleEventSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
