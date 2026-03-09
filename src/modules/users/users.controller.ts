import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto, UpdatePasswordDto, UpdateNotificationsDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  async getMe(@CurrentUser('_id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('me')
  async updateMe(
    @CurrentUser('_id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, dto);
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
