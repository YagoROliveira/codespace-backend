import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Track, TrackSchema } from '../tracks/schemas/track.schema';
import { UserTrackProgress, UserTrackProgressSchema } from '../tracks/schemas/user-track-progress.schema';
import { Session, SessionSchema } from '../sessions/schemas/session.schema';
import { Subscription, SubscriptionSchema } from '../plans/schemas/subscription.schema';
import { Plan, PlanSchema } from '../plans/schemas/plan.schema';
import { CodeEvaluation, CodeEvaluationSchema } from './schemas/code-evaluation.schema';
import { PaymentTransaction, PaymentTransactionSchema } from './schemas/payment-transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Track.name, schema: TrackSchema },
      { name: UserTrackProgress.name, schema: UserTrackProgressSchema },
      { name: Session.name, schema: SessionSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: Plan.name, schema: PlanSchema },
      { name: CodeEvaluation.name, schema: CodeEvaluationSchema },
      { name: PaymentTransaction.name, schema: PaymentTransactionSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule { }
