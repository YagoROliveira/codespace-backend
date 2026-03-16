import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CacheShort } from '../../common/interceptors/cache-control.interceptor';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get()
  @CacheShort()
  async getDashboard(@CurrentUser('_id') userId: string) {
    return this.dashboardService.getDashboard(userId);
  }
}
