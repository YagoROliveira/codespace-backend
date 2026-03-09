import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  channelId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsMongoId()
  parentMessageId?: string;
}

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}
