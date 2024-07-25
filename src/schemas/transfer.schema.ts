import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { TransferItem } from '@/interfaces';

export type TransferDocument = TransferSchemaModel & Document;

@Schema({
  versionKey: false,
})
export class TransferSchemaModel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Number })
  chainId: number;

  @Prop({ type: String })
  addressHash: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: Array<TransferItem> })
  tokenTransfers: [TransferItem];
}

export const TransferSchema = SchemaFactory.createForClass(TransferSchemaModel);
