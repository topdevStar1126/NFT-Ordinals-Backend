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
import { TransferItem } from '@/interfaces';
export type TransferDocument = TransferSchemaModel & Document;
export declare class TransferSchemaModel {
    _id: mongoose.Schema.Types.ObjectId;
    chainId: number;
    addressHash: string;
    token: string;
    tokenTransfers: [TransferItem];
}
export declare const TransferSchema: mongoose.Schema<TransferSchemaModel, mongoose.Model<TransferSchemaModel, any, any, any, mongoose.Document<unknown, any, TransferSchemaModel> & TransferSchemaModel & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, TransferSchemaModel, mongoose.Document<unknown, {}, mongoose.FlatRecord<TransferSchemaModel>> & mongoose.FlatRecord<TransferSchemaModel> & Required<{
    _id: mongoose.Schema.Types.ObjectId;
}>>;
