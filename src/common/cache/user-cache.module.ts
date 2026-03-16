import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../modules/users/schemas/user.schema';
import { UserCacheService } from './user-cache.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserCacheService],
  exports: [UserCacheService],
})
export class UserCacheModule { }
