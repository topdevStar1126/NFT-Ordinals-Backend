import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type TokenTickerDocument = TokenTickerSchemaModel & Document;

@Schema({
  versionKey: false,
})
export class TokenTickerSchemaModel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  slug: string;
  static schema: any;
}

export const TokenTickerSchema = SchemaFactory.createForClass(
  TokenTickerSchemaModel,
);
