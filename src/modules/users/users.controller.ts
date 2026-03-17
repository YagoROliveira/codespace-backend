import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto, UpdateNotificationsDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UploadsService } from '../uploads/uploads.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadsService: UploadsService,
  ) { }

  /** Resolve avatar field to signed URL */
  private async withSignedAvatar(user: any) {
    if (!user) return user;
    const obj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
    obj.avatar = await this.uploadsService.resolveAvatarUrl(obj.avatar);
    return obj;
  }

  @Get('me')
  async getMe(@CurrentUser('_id') userId: string) {
    const user = await this.usersService.findById(userId);
    return this.withSignedAvatar(user);
  }

  @Put('me')
  async updateMe(
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, dto);
    return this.withSignedAvatar(user);
  }

  @Put('me/password')
  async updatePassword(
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdatePasswordDto,
  ) {
    await this.usersService.updatePassword(userId, dto);
    return { message: 'Senha atualizada com sucesso' };
  }

  @Put('me/notifications')
  async updateNotifications(
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateNotificationsDto,
  ) {
    return this.usersService.updateNotifications(userId, dto);
  }

  @Delete('me')
  async deleteAccount(@CurrentUser('_id') userId: string) {
    await this.usersService.deleteUser(userId);
    return { message: 'Conta excluída com sucesso' };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
