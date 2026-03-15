import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { LabService } from './lab.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('lab')
export class LabController {
  constructor(private readonly labService: LabService) { }

  // ─── Student endpoints ───

  @UseGuards(JwtAuthGuard)
  @Post('provision')
  async provision(
    @CurrentUser('_id') userId: string,
    @Body('labType') labType: string,
  ) {
    return this.labService.provisionLab(userId, labType);
  }

  @UseGuards(JwtAuthGuard)
  @Post('stop')
  async stop(
    @CurrentUser('_id') userId: string,
    @Body('labType') labType: string,
  ) {
    return this.labService.stopLab(userId, labType);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(
    @CurrentUser('_id') userId: string,
    @Query('labType') labType?: string,
  ) {
    return this.labService.getLabStatus(userId, labType);
  }

  @UseGuards(JwtAuthGuard)
  @Post('heartbeat')
  async heartbeat(
    @CurrentUser('_id') userId: string,
    @Body('labType') labType: string,
  ) {
    await this.labService.heartbeat(userId, labType);
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('exercises/:exerciseId/start')
  async startExercise(
    @CurrentUser('_id') userId: string,
    @Param('exerciseId') exerciseId: string,
    @Body('labType') labType: string,
  ) {
    return this.labService.startExercise(userId, labType, exerciseId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('exercises/:exerciseId/complete')
  async completeExercise(
    @CurrentUser('_id') userId: string,
    @Param('exerciseId') exerciseId: string,
    @Body('labType') labType: string,
  ) {
    return this.labService.completeExercise(userId, labType, exerciseId);
  }

  // ─── Exercises (public read) ───

  @UseGuards(JwtAuthGuard)
  @Get('exercises')
  async listExercises(@Query('labType') labType?: string) {
    return this.labService.listExercises(labType);
  }

  @UseGuards(JwtAuthGuard)
  @Get('exercises/:id')
  async getExercise(@Param('id') id: string) {
    return this.labService.getExercise(id);
  }

  // ─── Admin endpoints ───

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/list')
  async adminListAll() {
    return this.labService.listAllLabs();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/:userId/provision')
  async adminProvision(
    @Param('userId') userId: string,
    @Body('labType') labType: string,
  ) {
    return this.labService.adminProvision(userId, labType);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/:userId/stop')
  async adminStop(
    @Param('userId') userId: string,
    @Body('labType') labType: string,
  ) {
    return this.labService.adminStop(userId, labType);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/:userId')
  async adminDestroy(
    @Param('userId') userId: string,
    @Body('labType') labType: string,
  ) {
    return this.labService.adminDestroy(userId, labType);
  }

  // ─── Admin Exercise CRUD ───

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/exercises')
  async createExercise(@Body() data: any) {
    return this.labService.createExercise(data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('admin/exercises/:id')
  async updateExercise(@Param('id') id: string, @Body() data: any) {
    return this.labService.updateExercise(id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/exercises/:id')
  async deleteExercise(@Param('id') id: string) {
    return this.labService.deleteExercise(id);
  }
}
