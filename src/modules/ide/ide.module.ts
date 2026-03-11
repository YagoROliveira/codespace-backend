import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IdeController } from './ide.controller';
import { IdeService } from './ide.service';
import { IdeContainer, IdeContainerSchema } from './schemas/ide-container.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: IdeContainer.name, schema: IdeContainerSchema },
    ]),
  ],
  controllers: [IdeController],
  providers: [IdeService],
  exports: [IdeService],
})
export class IdeModule { }
