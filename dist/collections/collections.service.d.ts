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
import { Model } from 'mongoose';
import { Collection } from '@/interfaces';
import { CreateCollectionDto, UpdateCollectionDto } from './collections.dto';
import { CollectionDocument } from '@/schemas/collection.schema';
export declare class CollectionsService {
    private readonly collectionModel;
    constructor(collectionModel: Model<CollectionDocument>);
    create(creator: string, createCollectionDto: CreateCollectionDto): Promise<Collection>;
    findAll(): Promise<Array<Collection>>;
    findAllByChainId(chainId: number): Promise<Array<Collection>>;
    findOne(chainId: number, address: string): Promise<Collection>;
    update(creator: string, chainId: number, address: string, updateCollectionDto: UpdateCollectionDto): Promise<Collection>;
}
