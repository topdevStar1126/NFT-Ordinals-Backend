import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type CollectionDocument = CollectionSchemaModel & Document;

@Schema({
  versionKey: false,
})
export class CollectionSchemaModel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  creator: string;

  @Prop({ type: Number })
  chainId: number;

  @Prop({ type: String })
  address: string;

  @Prop({ type: String })
  logo: string;

  @Prop({ type: String })
  banner: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: [String] })
  classification: [string];

  @Prop({
    type: Date,
  })
  createdAt: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(
  CollectionSchemaModel,
);
