import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto, UpdateSessionDto } from './dto/session.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) { }

  @Get()
  async findByUser(@CurrentUser('_id') userId: string) {
    return this.sessionsService.findByUser(userId);
  }

  @Get('upcoming')
  async findUpcoming(@CurrentUser('_id') userId: string) {
    return this.sessionsService.findUpcoming(userId);
  }

  @Get('past')
  async findPast(@CurrentUser('_id') userId: string) {
    return this.sessionsService.findPast(userId);
  }

  @Get('week')
  async getWeekSessions(@CurrentUser('_id') userId: string) {
    return this.sessionsService.getWeekSessions(userId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.sessionsService.findById(id);
  }

  @Post()
  async create(
    @CurrentUser('_id') userId: string,
    @Body() dto: CreateSessionDto,
  ) {
    return this.sessionsService.create(userId, dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSessionDto) {
    return this.sessionsService.update(id, dto);
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.sessionsService.cancel(id);
  }
}
