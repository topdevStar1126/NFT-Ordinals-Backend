import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { Document } from 'mongoose';

export type UploadDocument = UploadSchemaModel & Document;

@Schema({
  versionKey: false,
})
export class UploadSchemaModel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String })
  originalname: string;

  @Prop({ type: String })
  encoding: string;

  @Prop({ type: String })
  mimetype: string;

  @Prop({ type: String })
  destination: string;

  @Prop({ type: String })
  filename: string;

  @Prop({ type: String })
  path: string;

  @Prop({ type: Number })
  size: number;

  @Prop({ type: Date, default: new Date(Date.now()) })
  createdAt: Date;
}

export const UploadSchema = SchemaFactory.createForClass(UploadSchemaModel);
