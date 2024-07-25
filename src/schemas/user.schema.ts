import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserDocument = UserSchemaModel & Document;

@Schema({
  versionKey: false,
})
export class UserSchemaModel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  nickname: string;

  @Prop({ type: String })
  bio: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  wallet: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  email: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  discord: string;

  @Prop({ type: String, trim: true, index: true, unique: true, sparse: true })
  telegram: string;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({
    type: Date,
  })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaModel);
