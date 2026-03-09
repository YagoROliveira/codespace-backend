import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certsService: CertificatesService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyCertificates(@CurrentUser('_id') userId: string) {
    return this.certsService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats(@CurrentUser('_id') userId: string) {
    return this.certsService.getStats(userId);
  }

  @Public()
  @Get('verify/:code')
  async verify(@Param('code') code: string) {
    return this.certsService.findByCode(code);
  }
}
