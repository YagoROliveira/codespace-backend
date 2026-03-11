import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) { }

  // ─── Student endpoints ───

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyWorkspace(@CurrentUser('_id') userId: string) {
    return this.workspacesService.getWorkspace(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/name')
  async updateMyWorkspaceName(
    @CurrentUser('_id') userId: string,
    @Body('name') name: string,
  ) {
    return this.workspacesService.updateWorkspaceName(userId, name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/files')
  async createFile(
    @CurrentUser('_id') userId: string,
    @Body() body: { path: string; content?: string; language?: string; isFolder?: boolean },
  ) {
    return this.workspacesService.createFile(
      userId,
      body.path,
      body.content || '',
      body.language || 'plaintext',
      body.isFolder || false,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/files')
  async updateFile(
    @CurrentUser('_id') userId: string,
    @Body() body: { path: string; content: string },
  ) {
    return this.workspacesService.updateFile(userId, body.path, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/files/rename')
  async renameFile(
    @CurrentUser('_id') userId: string,
    @Body() body: { oldPath: string; newPath: string },
  ) {
    return this.workspacesService.renameFile(userId, body.oldPath, body.newPath);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/files')
  async deleteFile(
    @CurrentUser('_id') userId: string,
    @Body('path') path: string,
  ) {
    return this.workspacesService.deleteFile(userId, path);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/files/bulk-save')
  async bulkSave(
    @CurrentUser('_id') userId: string,
    @Body('files') files: { path: string; content: string }[],
  ) {
    return this.workspacesService.bulkSaveFiles(userId, files);
  }

  // ─── Admin / Mentor endpoints ───

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('user/:userId')
  async getStudentWorkspace(@Param('userId') userId: string) {
    return this.workspacesService.getWorkspaceByUserId(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('user/:userId/files')
  async updateStudentFile(
    @Param('userId') userId: string,
    @Body() body: { path: string; content: string },
  ) {
    return this.workspacesService.updateFileAsAdmin(userId, body.path, body.content);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('user/:userId/files')
  async createStudentFile(
    @Param('userId') userId: string,
    @Body() body: { path: string; content?: string; language?: string; isFolder?: boolean },
  ) {
    return this.workspacesService.createFileAsAdmin(
      userId,
      body.path,
      body.content || '',
      body.language || 'plaintext',
      body.isFolder || false,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('user/:userId/files')
  async deleteStudentFile(
    @Param('userId') userId: string,
    @Body('path') path: string,
  ) {
    return this.workspacesService.deleteFileAsAdmin(userId, path);
  }
}
