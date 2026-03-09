import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { ResourceBookmark, ResourceBookmarkSchema } from './schemas/resource.schema';
import { ResourceLike, ResourceLikeSchema } from './schemas/resource.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
      { name: ResourceBookmark.name, schema: ResourceBookmarkSchema },
      { name: ResourceLike.name, schema: ResourceLikeSchema },
    ]),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService],
})
export class ResourcesModule { }
