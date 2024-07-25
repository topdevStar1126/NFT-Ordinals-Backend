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
import { TokenTickerDocument } from '@/schemas/tokenTicker.schema';
import { InscBrc20TokenDto } from './inscBrc20Token.dto';
export declare class InscBrc20TokensService {
    private readonly tokenTickerModel;
    private readonly brc20Tokens;
    constructor(tokenTickerModel: Model<TokenTickerDocument>);
    findAll_tokenList(): Promise<InscBrc20TokenDto[]>;
    fetchTokenDetails(pageTokens: any): Promise<any[]>;
    findAll(): Promise<any>;
    getInscriptionData(tokenInscriptionId: string): Promise<any>;
    getExistanceOfToken(token: string): Promise<any>;
    getMintRateOfToken(token: string): Promise<any>;
    getTest(): Promise<any>;
    create(brc20TokenDto: InscBrc20TokenDto): void;
    getTokenNames(keyWord: string): Promise<any>;
}
