/// <reference types="multer" />
import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    downloadSingle(encodedName: string, res: Response): Promise<StreamableFile>;
    uploadSingle(request: any, file: Express.Multer.File): Promise<{
        path: string;
    }>;
}
