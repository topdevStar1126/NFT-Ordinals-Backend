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
export type TokenTickerDocument = TokenTickerSchemaModel & Document;
export declare class TokenTickerSchemaModel {
    _id: mongoose.Schema.Types.ObjectId;
    slug: string;
}
export declare const TokenTickerSchema: mongoose.Schema<TokenTickerSchemaModel, mongoose.Model<TokenTickerSchemaModel, any, any, any, mongoose.Document<unknown, any, TokenTickerSchemaModel> & TokenTickerSchemaModel & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, TokenTickerSchemaModel, mongoose.Document<unknown, {}, mongoose.FlatRecord<TokenTickerSchemaModel>> & mongoose.FlatRecord<TokenTickerSchemaModel> & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>>;
