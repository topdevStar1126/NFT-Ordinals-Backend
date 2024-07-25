import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Express } from 'express';
import { Model } from 'mongoose';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload as S3Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import { Upload } from '@/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { UploadSchemaModel } from '@/schemas';
import { UploadDocument } from '@/schemas/upload.schema';

@Injectable()
export class UploadsService {
  private readonly s3Client: S3Client;
  constructor(
    @InjectModel(UploadSchemaModel.name)
    private readonly uploadModel: Model<UploadDocument>,
  ) {
    this.s3Client = new S3Client({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
      },
    });
  }

  public async getFileInfo(encodedname: string): Promise<{ fileInfo: Upload }> {
    const documents = await this.uploadModel.find({ filename: encodedname });
    if (documents.length == 0) {
      throw new HttpException(
        `Wrong file id provided.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return { fileInfo: documents[0] as any as Upload };
  }

  public async uploadSingle(
    file: Express.Multer.File,
  ): Promise<{ path: string }> {
    const fileKey = uuidv4();
    const uploadS3 = new S3Upload({
      client: this.s3Client,
      params: {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });
    await uploadS3.done();

    const newUpload = file as any as Upload;
    newUpload.createdAt = new Date();
    newUpload.path = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;
    const upload = new this.uploadModel(newUpload);
    await upload.save();

    return {
      path: upload.path,
    };
  }

  // public async uploadMultiple(
  //   newUploads: Upload[],
  // ): Promise<{ paths: string[] }> {
  //   const uploads: string[] = await Promise.all(
  //     newUploads.map(async (newUpload) => {
  //       newUpload.createdAt = new Date();
  //       const upload = await this.uploadModel.create(newUpload);
  //       return '/uploads/' + upload.filename;
  //     }),
  //   );
  //   return { paths: uploads };
  // }
}
