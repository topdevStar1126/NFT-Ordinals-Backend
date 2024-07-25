import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Res,
  StreamableFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Express } from 'express';

import { Upload } from '@/interfaces';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';
import { parse } from 'svg-parser';
import { JSDOM } from 'jsdom';
import *  as DOMPurify from "dompurify";
import { ApiConsumes } from '@nestjs/swagger';
import { ApiFile, ApiMultiFile } from '@/decorators';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '@/auth/auth.guard';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Get(':encodedName')
  public async downloadSingle(
    @Param('encodedName') encodedName: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { fileInfo } = await this.uploadsService.getFileInfo(encodedName);
    const file = createReadStream(
      join(process.cwd(), `./uploads/${fileInfo.filename}`),
    );
    res.set({
      'Content-Type': fileInfo.mimetype,
      'Content-Disposition': `${fileInfo.mimetype.indexOf('image') == 0 ||
        fileInfo.mimetype.indexOf('audio') == 0 ||
        fileInfo.mimetype.indexOf('video') == 0
        ? 'inline'
        : 'attachment'
        }; filename="${fileInfo.originalname}"`,
      'Content-Length': fileInfo.size,
      'X-Content-Type-Options': 'nosniff',
    });
    return Promise.resolve(new StreamableFile(file));
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MiB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/svg+xml') {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type'), false);
        }
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  public uploadSingle(
    @Req() request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ path: string }> {
    if (file.mimetype === 'image/svg+xml') {
      const fileContent = file.buffer.toString('utf8');
      try {
        parse(fileContent);
      } catch (error) {
        throw new Error('Invalid SVG file');
      }
      const window = new JSDOM('').window;
      const purify = DOMPurify(window);
      const sanitizedSvg = purify.sanitize(fileContent, {
        USE_PROFILES: { svg: true }, // Only allow SVG elements
      });
      file.buffer = Buffer.from(sanitizedSvg);
    }
    return this.uploadsService.uploadSingle(file);
  }

  // @Post('/multiple')
  // @ApiConsumes('multipart/form-data')
  // @ApiMultiFile()
  // @UseInterceptors(FilesInterceptor('files', 10))
  // public uploadMultiple(
  //   @UploadedFiles() files: Upload[],
  // ): Promise<{ paths: string[] }> {
  //   return this.uploadsService.uploadMultiple(files);
  // }
}
