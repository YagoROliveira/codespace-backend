import {
  Controller, Post, UseGuards, UseInterceptors, Logger,
  UploadedFile, BadRequestException, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UploadsService } from './uploads.service';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(private readonly uploadsService: UploadsService) { }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
          return cb(new BadRequestException('Tipo de arquivo não permitido. Use JPG, PNG, WebP ou GIF.'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
    @CurrentUser('_id') userId?: string,
  ) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');

    const safeFolder = (folder || 'general').replace(/[^a-zA-Z0-9_-]/g, '');
    const sizeKB = (file.size / 1024).toFixed(1);
    this.logger.log(`[UPLOAD START] user=${userId} folder=${safeFolder} file="${file.originalname}" type=${file.mimetype} size=${sizeKB}KB`);

    const start = Date.now();
    const url = await this.uploadsService.upload(safeFolder, file);
    const elapsed = Date.now() - start;

    this.logger.log(`[UPLOAD OK] user=${userId} folder=${safeFolder} time=${elapsed}ms url=${url}`);
    return { url };
  }
}
