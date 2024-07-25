import { Module } from '@nestjs/common';
import { updateServerDataController } from './updateServerData.controllers';
import { UpdateServerDataService } from './updateServerData.service';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [updateServerDataController],
  providers: [UpdateServerDataService],
})
export class UpdateServerDataModule {}
