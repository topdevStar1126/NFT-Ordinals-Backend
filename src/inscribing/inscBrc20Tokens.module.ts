import { Module } from '@nestjs/common';
import { InscBrc20TokensController } from './inscBrc20Tokens.controller';
import { InscBrc20TokensService } from './inscBrc20Tokens.service';

import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [InscBrc20TokensController],
  providers: [InscBrc20TokensService],
})
export class InscBrc20TokensModule {}
