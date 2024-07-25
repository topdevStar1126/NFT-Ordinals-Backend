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
import { Operator } from '@/interfaces';
import { OperatorDto } from './operator.dto';
import { OperatorDocument } from '@/schemas/operator.schema';
export declare class OperatorService {
    private readonly operatorModel;
    constructor(operatorModel: Model<OperatorDocument>);
    initializeAdminOperator(): Promise<void>;
    findPaginated(filter: any, page: number, limit: number): Promise<{
        data: Operator[];
        total: number;
    }>;
    createOperator(operatorDto: OperatorDto): Promise<Operator>;
    findOneOperatorName(username: string): Promise<Operator>;
    findById(id: String): Promise<Operator>;
    updateOperator(operatorDto: OperatorDto): Promise<Operator>;
    updatePwd(operatorDto: OperatorDto): Promise<Operator>;
}
