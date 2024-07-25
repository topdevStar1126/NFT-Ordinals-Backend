import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Balance } from '@/interfaces';

export type AccountDocument = AccountSchemaModel & Document;

@Schema({
  versionKey: false,
})
export class AccountSchemaModel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number })
  chainId: number;

  @Prop({ type: String })
  addressHash: string;

  @Prop({ type: Array<Balance> })
  tokenList: [Balance];
}

export const AccountSchema = SchemaFactory.createForClass(AccountSchemaModel);
