// inscribingHistory.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type InscribingHistoryDocument = InscribingHistorySchemaModel & Document;

@Schema({collection: 'inscribingHistory',  versionKey: false })
export class InscribingHistorySchemaModel {
  _id: mongoose.Schema.Types.ObjectId;
  
  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  type: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  status: string;

  @Prop({ type: Number, trim: true, index: true, unique: true, sparse: true })
  networkFee: number;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  paymentAddress: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  recipientAddress: string;

  @Prop({ type: Date })
  createdAt: Date;
  static schema: any;
}

export const InscribingHistorySchema = SchemaFactory.createForClass(InscribingHistorySchemaModel);
