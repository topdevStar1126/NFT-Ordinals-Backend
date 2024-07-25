import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type TokenDocument = TokenSchemaModel & Document;

@Schema({
  versionKey: false,
})
export class TokenSchemaModel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  chainId: string;

  @Prop({ type: String })
  contractAddress: string;

  @Prop({ type: String })
  decimals: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  symbol: string;

  @Prop({ type: String })
  totalSupply: string;

  @Prop({ type: String })
  type: string;
}

export const TokenSchema = SchemaFactory.createForClass(TokenSchemaModel);
