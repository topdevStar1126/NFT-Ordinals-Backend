import { Module } from '@nestjs/common';
import { CreateListingsController } from './createListings.controller';
import { CreateListingsService } from './createListings.service';

import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [CreateListingsController],
  providers: [CreateListingsService],
})
export class createListingsModule {}
