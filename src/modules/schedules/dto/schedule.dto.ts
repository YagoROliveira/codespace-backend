import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// ─── Template Item DTO ───
export class TemplateItemDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['study', 'session', 'challenge', 'project', 'review', 'meeting', 'rest', 'other'])
  type?: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;
}

// ─── Schedule Template DTOs ───
export class CreateScheduleTemplateDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['essencial', 'profissional', 'elite'])
  planSlug: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateItemDto)
  items?: TemplateItemDto[];
}

export class UpdateScheduleTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['essencial', 'profissional', 'elite'])
  planSlug?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateItemDto)
  items?: TemplateItemDto[];
}

// ─── Student Schedule DTOs ───
export class ScheduleItemDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  startTime: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['study', 'session', 'challenge', 'project', 'review', 'meeting', 'rest', 'other'])
  type?: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;
}

export class AssignScheduleDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  items?: ScheduleItemDto[];
}

export class UpdateStudentScheduleDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  items?: ScheduleItemDto[];
}

// ─── Schedule Event DTOs ───
export class CreateScheduleEventDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['study', 'session', 'challenge', 'project', 'review', 'meeting', 'deadline', 'other'])
  type?: string;

  @IsString()
  scheduledDate: string; // ISO date string

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsString()
  link?: string;
}

export class UpdateScheduleEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['study', 'session', 'challenge', 'project', 'review', 'meeting', 'deadline', 'other'])
  type?: string;

  @IsOptional()
  @IsString()
  scheduledDate?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsNumber()
  durationMinutes?: number;

  @IsOptional()
  @IsEnum(['pending', 'completed', 'cancelled', 'skipped'])
  status?: string;

  @IsOptional()
  @IsString()
  link?: string;
}
