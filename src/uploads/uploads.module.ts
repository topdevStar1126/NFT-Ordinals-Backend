import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { DatabaseModule } from '../database/database.module';
import { UploadsService } from './uploads.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UploadsController],
  providers: [UploadsService],
})
export class UploadsModule {}
