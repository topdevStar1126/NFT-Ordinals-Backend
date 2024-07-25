import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserSchema,
  UserSchemaModel,
  CollectionSchema,
  CollectionSchemaModel,
  UploadSchema,
  UploadSchemaModel,
  TokenSchema,
  TokenSchemaModel,
  AccountSchema,
  AccountSchemaModel,
  TransferSchema,
  TransferSchemaModel,
  TokenTickerSchema,
  TokenTickerSchemaModel,
} from '@/schemas';
import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_URL);


const modules = [
  MongooseModule.forRoot(process.env.DB_URL),
  MongooseModule.forFeatureAsync([
    {
      name: UserSchemaModel.name,
      useFactory: () => {
        const schema = UserSchema;
        return schema;
      },
      collection: 'users',
    },
    {
      name: CollectionSchemaModel.name,
      useFactory: () => {
        const schema = CollectionSchema;
        return schema;
      },
      collection: 'collections',
    },
    {
      name: UploadSchemaModel.name,
      useFactory: () => {
        const schema = UploadSchema;
        return schema;
      },
      collection: 'uploads',
    },
    {
      name: TokenSchemaModel.name,
      useFactory: () => {
        const schema = TokenSchema;
        return schema;
      },
      collection: 'tokens',
    },
    {
      name: AccountSchemaModel.name,
      useFactory: () => {
        const schema = AccountSchema;
        return schema;
      },
      collection: 'accounts',
    },
    {
      name: TransferSchemaModel.name,
      useFactory: () => {
        const schema = TokenTickerSchema;
        return schema;
      },
      collection: 'transfers',
    },

    //Enthusiast K.G
    {
      name: TokenTickerSchemaModel.name,
      useFactory: () => {
        const schema = TokenTickerSchema;
        return schema;
      },
      collection: 'tokenTickers',
    },
  ]),
];
@Module({
  imports: [...modules],
  exports: [...modules],
})
export class DatabaseModule {}
