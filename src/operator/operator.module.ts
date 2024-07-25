// operator.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OperatorSchema, OperatorSchemaModel } from '@/schemas';
import { OperatorService } from './operator.service';
import { DatabaseModule } from '@/database/database.module';
import { OperatorController } from '@/operator/operator.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseModule,
    MongooseModule.forFeature([{ name: OperatorSchemaModel.name, schema: OperatorSchema }]),
    ConfigModule,
  ],
  controllers: [OperatorController],
  providers: [OperatorService],
  exports: [OperatorService],
})
export class OperatorModule {
}
