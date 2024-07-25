/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import mongoose from 'mongoose';
export type UserDocument = UserSchemaModel & Document;
export declare class UserSchemaModel {
    _id: mongoose.Schema.Types.ObjectId;
    nickname: string;
    bio: string;
    wallet: string;
    email: string;
    discord: string;
    telegram: string;
    name: string;
    avatar: string;
    createdAt: Date;
}
export declare const UserSchema: mongoose.Schema<UserSchemaModel, mongoose.Model<UserSchemaModel, any, any, any, mongoose.Document<unknown, any, UserSchemaModel> & UserSchemaModel & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, UserSchemaModel, mongoose.Document<unknown, {}, mongoose.FlatRecord<UserSchemaModel>> & mongoose.FlatRecord<UserSchemaModel> & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>>;
