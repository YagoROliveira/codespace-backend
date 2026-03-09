import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsEnum(['essencial', 'profissional', 'elite', 'free'])
  plan?: string;
}

export class UpdatePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  newPassword: string;
}

export class UpdateNotificationsDto {
  @IsOptional()
  email?: boolean;

  @IsOptional()
  push?: boolean;

  @IsOptional()
  mentorReminders?: boolean;

  @IsOptional()
  communityUpdates?: boolean;

  @IsOptional()
  weeklyReport?: boolean;
}
