import { Module } from '@nestjs/common';
import { Brc20TokensController } from './brc20Tokens.controller';
import { Brc20TokensService } from './brc20Tokens.service';

import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [Brc20TokensController],
  providers: [Brc20TokensService],
})
export class Brc20TokensModule {}
