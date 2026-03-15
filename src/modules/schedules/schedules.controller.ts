import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  CreateScheduleTemplateDto,
  UpdateScheduleTemplateDto,
  AssignScheduleDto,
  UpdateStudentScheduleDto,
  CreateScheduleEventDto,
  UpdateScheduleEventDto,
} from './dto/schedule.dto';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) { }

  // ─── TEMPLATES (Admin/Mentor) ───

  @Get('templates')
  async listTemplates(@Query('planSlug') planSlug?: string) {
    return this.schedulesService.listTemplates(planSlug);
  }

  @Get('templates/:id')
  async getTemplate(@Param('id') id: string) {
    return this.schedulesService.getTemplate(id);
  }

  @Post('templates')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async createTemplate(@Body() dto: CreateScheduleTemplateDto) {
    return this.schedulesService.createTemplate(dto);
  }

  @Put('templates/:id')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async updateTemplate(@Param('id') id: string, @Body() dto: UpdateScheduleTemplateDto) {
    return this.schedulesService.updateTemplate(id, dto);
  }

  @Delete('templates/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async deleteTemplate(@Param('id') id: string) {
    return this.schedulesService.deleteTemplate(id);
  }

  // ─── STUDENT SCHEDULE ───

  @Get('my-schedule')
  async getMySchedule(@CurrentUser('_id') userId: string) {
    return this.schedulesService.getStudentSchedule(userId);
  }

  @Get('my-schedule/history')
  async getMyScheduleHistory(@CurrentUser('_id') userId: string) {
    return this.schedulesService.getStudentScheduleHistory(userId);
  }

  @Get('student/:userId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async getStudentSchedule(@Param('userId') userId: string) {
    return this.schedulesService.getStudentSchedule(userId);
  }

  @Post('assign')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async assignSchedule(
    @CurrentUser('_id') mentorId: string,
    @Body() dto: AssignScheduleDto,
  ) {
    return this.schedulesService.assignSchedule(mentorId, dto);
  }

  @Put(':scheduleId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async updateStudentSchedule(
    @Param('scheduleId') scheduleId: string,
    @CurrentUser('_id') mentorId: string,
    @Body() dto: UpdateStudentScheduleDto,
  ) {
    return this.schedulesService.updateStudentSchedule(scheduleId, mentorId, dto);
  }

  // ─── MENTOR: view all assigned schedules ───

  @Get('mentor/students')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async getMentorStudentSchedules(@CurrentUser('_id') mentorId: string) {
    return this.schedulesService.getMentorStudentSchedules(mentorId);
  }

  // ─── EVENTS ───

  @Get('events')
  async getMyEvents(
    @CurrentUser('_id') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.schedulesService.getStudentEvents(userId, startDate, endDate);
  }

  @Get('events/mentor')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async getMentorEvents(
    @CurrentUser('_id') mentorId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.schedulesService.getMentorEvents(mentorId, startDate, endDate);
  }

  @Post('events')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async createEvent(
    @CurrentUser('_id') mentorId: string,
    @Body() dto: CreateScheduleEventDto,
  ) {
    return this.schedulesService.createEvent(mentorId, dto);
  }

  @Put('events/:eventId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async updateEvent(
    @Param('eventId') eventId: string,
    @CurrentUser('_id') mentorId: string,
    @Body() dto: UpdateScheduleEventDto,
  ) {
    return this.schedulesService.updateEvent(eventId, mentorId, dto);
  }

  @Post('events/:eventId/complete')
  async completeEvent(
    @Param('eventId') eventId: string,
    @CurrentUser('_id') userId: string,
  ) {
    return this.schedulesService.completeEvent(eventId, userId);
  }

  @Delete('events/:eventId')
  @UseGuards(RolesGuard)
  @Roles('admin', 'mentor')
  async deleteEvent(
    @Param('eventId') eventId: string,
    @CurrentUser('_id') mentorId: string,
  ) {
    return this.schedulesService.deleteEvent(eventId, mentorId);
  }

  // ─── BOOKING INFO ───

  @Get('booking-info')
  async getBookingInfo(@CurrentUser('_id') userId: string) {
    return this.schedulesService.getBookingInfo(userId);
  }
}
