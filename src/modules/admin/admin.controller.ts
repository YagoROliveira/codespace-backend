import {
  Controller, Get, Post, Put, Delete,
  Param, Query, Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // ===================== DASHBOARD =====================
  @Get('dashboard')
  async getDashboard(): Promise<any> {
    return this.adminService.getDashboardStats();
  }

  // ===================== SYSTEM USERS =====================
  @Get('users')
  async getSystemUsers(
    @Query('search') search?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
  ): Promise<any> {
    return this.adminService.getSystemUsers({ search, role, status });
  }

  @Post('users')
  async createSystemUser(
    @Body() data: {
      name: string;
      email: string;
      password: string;
      role: string;
      phone?: string;
      bio?: string;
    },
  ): Promise<any> {
    return this.adminService.createSystemUser(data);
  }

  @Put('users/:id')
  async updateSystemUser(
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ): Promise<any> {
    return this.adminService.updateSystemUser(id, data);
  }

  @Delete('users/:id')
  async deleteSystemUser(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteSystemUser(id);
  }

  // ===================== STUDENTS =====================
  @Get('students')
  async getStudents(
    @Query('search') search?: string,
    @Query('plan') plan?: string,
    @Query('status') status?: string,
  ): Promise<any> {
    return this.adminService.getStudents({ search, plan, status });
  }

  @Get('students/:id')
  async getStudentDetail(@Param('id') id: string): Promise<any> {
    return this.adminService.getStudentDetail(id);
  }

  @Post('students')
  async createStudent(
    @Body() data: {
      name: string;
      email: string;
      password: string;
      plan?: string;
      phone?: string;
      bio?: string;
    },
  ): Promise<any> {
    return this.adminService.createStudent(data);
  }

  @Put('students/:id')
  async updateStudent(
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ): Promise<any> {
    return this.adminService.updateStudent(id, data);
  }

  @Delete('students/:id')
  async deleteStudent(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteStudent(id);
  }

  @Put('students/:id/mentor')
  async assignMentor(
    @Param('id') studentId: string,
    @Body('mentorId') mentorId: string | null,
  ): Promise<any> {
    return this.adminService.assignMentor(studentId, mentorId);
  }

  // ===================== STUDENT TRACKS =====================
  @Post('students/:id/tracks')
  async enrollStudentInTrack(
    @Param('id') studentId: string,
    @Body('trackId') trackId: string,
  ): Promise<any> {
    return this.adminService.enrollStudentInTrack(studentId, trackId);
  }

  @Delete('students/:studentId/tracks/:trackId')
  async unenrollStudentFromTrack(
    @Param('studentId') studentId: string,
    @Param('trackId') trackId: string,
  ): Promise<any> {
    return this.adminService.unenrollStudentFromTrack(studentId, trackId);
  }

  // ===================== STUDENT NOTES =====================
  @Post('students/:id/notes')
  async addStudentNote(
    @Param('id') studentId: string,
    @CurrentUser('_id') adminId: string,
    @Body('content') content: string,
  ): Promise<any> {
    return this.adminService.addStudentNote(studentId, adminId, content);
  }

  @Delete('students/:studentId/notes/:noteId')
  async deleteStudentNote(
    @Param('studentId') studentId: string,
    @Param('noteId') noteId: string,
  ): Promise<any> {
    return this.adminService.deleteStudentNote(studentId, noteId);
  }

  // ===================== SESSIONS =====================
  @Get('sessions')
  async getSessions(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('studentId') studentId?: string,
    @Query('mentorId') mentorId?: string,
  ): Promise<any> {
    return this.adminService.getAllSessions({ status, type, studentId, mentorId });
  }

  @Get('sessions/:id')
  async getSessionDetail(@Param('id') id: string): Promise<any> {
    return this.adminService.getSessionDetail(id);
  }

  @Get('mentors')
  async getMentors(): Promise<any> {
    return this.adminService.getMentors();
  }

  @Post('sessions')
  async createSession(
    @CurrentUser('_id') adminId: string,
    @Body() data: {
      userId: string;
      mentorId?: string;
      title: string;
      description?: string;
      scheduledAt: string;
      durationMinutes?: number;
      type?: string;
      meetingUrl?: string;
      topics?: string[];
    },
  ): Promise<any> {
    return this.adminService.createSession(data.mentorId || adminId, data);
  }

  @Put('sessions/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ): Promise<any> {
    return this.adminService.updateSession(id, data);
  }

  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteSession(id);
  }

  @Put('sessions/:id/no-show')
  async markSessionNoShow(@Param('id') id: string): Promise<any> {
    return this.adminService.markSessionNoShow(id);
  }

  @Post('sessions/:id/prontuario')
  async addSessionProntuario(
    @Param('id') sessionId: string,
    @CurrentUser('_id') authorId: string,
    @Body() data: { subjective?: string; objective?: string; assessment?: string; plan?: string; notes?: string },
  ): Promise<any> {
    return this.adminService.addSessionProntuario(sessionId, authorId, data);
  }

  @Put('sessions/:sessionId/prontuario/:entryId')
  async updateSessionProntuario(
    @Param('sessionId') sessionId: string,
    @Param('entryId') entryId: string,
    @Body() data: { subjective?: string; objective?: string; assessment?: string; plan?: string; notes?: string },
  ): Promise<any> {
    return this.adminService.updateSessionProntuario(sessionId, entryId, data);
  }

  @Delete('sessions/:sessionId/prontuario/:entryId')
  async deleteSessionProntuario(
    @Param('sessionId') sessionId: string,
    @Param('entryId') entryId: string,
  ): Promise<any> {
    return this.adminService.deleteSessionProntuario(sessionId, entryId);
  }

  @Post('sessions/:id/notify')
  async notifyStudent(@Param('id') id: string): Promise<any> {
    return this.adminService.notifyStudent(id);
  }

  // ===================== TRACKS =====================
  @Get('tracks')
  async getTracks(): Promise<any> {
    return this.adminService.getAllTracks();
  }

  @Post('tracks')
  async createTrack(@Body() data: any): Promise<any> {
    return this.adminService.createTrack(data);
  }

  @Put('tracks/:id')
  async updateTrack(
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ): Promise<any> {
    return this.adminService.updateTrack(id, data);
  }

  @Delete('tracks/:id')
  async deleteTrack(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteTrack(id);
  }

  // ===================== SUBSCRIPTIONS =====================
  @Get('subscriptions')
  async getSubscriptions(@Query('status') status?: string): Promise<any> {
    return this.adminService.getAllSubscriptions({ status });
  }

  @Put('subscriptions/:id')
  async updateSubscription(
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ): Promise<any> {
    return this.adminService.updateSubscription(id, data);
  }

  // ===================== TRACK DETAIL =====================
  @Get('tracks/:id')
  async getTrackDetail(@Param('id') id: string): Promise<any> {
    return this.adminService.getTrackDetail(id);
  }

  @Post('tracks/:id/documents')
  async addTrackDocument(
    @Param('id') trackId: string,
    @Body() data: { title: string; description?: string; fileUrl: string; fileType?: string; fileSizeKb?: number },
  ): Promise<any> {
    return this.adminService.addTrackDocument(trackId, data);
  }

  @Delete('tracks/:trackId/documents/:documentId')
  async deleteTrackDocument(
    @Param('trackId') trackId: string,
    @Param('documentId') documentId: string,
  ): Promise<any> {
    return this.adminService.deleteTrackDocument(trackId, documentId);
  }

  // ===================== CODE EVALUATIONS =====================
  @Get('students/:id/evaluations')
  async getStudentEvaluations(@Param('id') studentId: string): Promise<any> {
    return this.adminService.getStudentEvaluations(studentId);
  }

  @Post('evaluations')
  async createCodeEvaluation(
    @CurrentUser('_id') reviewerId: string,
    @Body() data: any,
  ): Promise<any> {
    return this.adminService.createCodeEvaluation(reviewerId, data);
  }

  @Put('evaluations/:id')
  async updateCodeEvaluation(
    @Param('id') id: string,
    @Body() data: Record<string, any>,
  ): Promise<any> {
    return this.adminService.updateCodeEvaluation(id, data);
  }

  @Delete('evaluations/:id')
  async deleteCodeEvaluation(@Param('id') id: string): Promise<any> {
    return this.adminService.deleteCodeEvaluation(id);
  }

  // ===================== PAYMENT TRANSACTIONS =====================
  @Get('students/:id/payments')
  async getStudentPayments(@Param('id') studentId: string): Promise<any> {
    return this.adminService.getStudentPayments(studentId);
  }

  @Get('students/:id/payments/summary')
  async getStudentPaymentSummary(@Param('id') studentId: string): Promise<any> {
    return this.adminService.getStudentPaymentSummary(studentId);
  }

  @Post('payments')
  async createPaymentTransaction(
    @Body() data: any,
  ): Promise<any> {
    return this.adminService.createPaymentTransaction(data);
  }
}
