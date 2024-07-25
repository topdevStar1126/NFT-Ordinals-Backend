// operator.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OperatorDocument = OperatorSchemaModel & Document;

@Schema({collection: 'operator',  versionKey: false })
export class OperatorSchemaModel {
  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  nickname: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  username: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  email: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  password: string;

  @Prop({ type: Date })
  createdAt: Date;
}

export const OperatorSchema = SchemaFactory.createForClass(OperatorSchemaModel);
