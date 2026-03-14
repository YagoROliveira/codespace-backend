import {
  Controller, Get, Post, Delete,
  Param, UseGuards,
} from '@nestjs/common';
import { IdeService } from './ide.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('ide')
export class IdeController {
  constructor(private readonly ideService: IdeService) { }

  // ─── Student endpoints ───

  /** Provision or start the IDE for the authenticated user */
  @UseGuards(JwtAuthGuard)
  @Post('provision')
  async provision(@CurrentUser('_id') userId: string) {
    return this.ideService.provisionIde(userId);
  }

  /** Stop the IDE container for the authenticated user */
  @UseGuards(JwtAuthGuard)
  @Post('stop')
  async stop(@CurrentUser('_id') userId: string) {
    return this.ideService.stopIde(userId);
  }

  /** Heartbeat — keeps IDE alive (resets inactivity timer) */
  @UseGuards(JwtAuthGuard)
  @Post('heartbeat')
  async heartbeat(@CurrentUser('_id') userId: string) {
    await this.ideService.heartbeat(userId);
    return { ok: true };
  }

  /** Get IDE status for the authenticated user */
  @UseGuards(JwtAuthGuard)
  @Get('status')
  async status(@CurrentUser('_id') userId: string) {
    return this.ideService.getStatus(userId);
  }

  // ─── Admin / Mentor endpoints ───

  /** List all IDE containers (admin only) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/list')
  async listAll() {
    return this.ideService.listAll();
  }

  /** Get IDE status for a specific student (admin) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin/:userId/status')
  async adminStatus(@Param('userId') userId: string) {
    return this.ideService.getStatus(userId);
  }

  /** Provision or start IDE for a specific student (admin) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/:userId/provision')
  async adminProvision(@Param('userId') userId: string) {
    return this.ideService.provisionIde(userId);
  }

  /** Stop IDE for a specific student (admin) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('admin/:userId/stop')
  async adminStop(@Param('userId') userId: string) {
    return this.ideService.stopIde(userId);
  }

  /** Destroy IDE container for a specific student (admin) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('admin/:userId')
  async adminDestroy(@Param('userId') userId: string) {
    return this.ideService.destroyIde(userId);
  }
}
