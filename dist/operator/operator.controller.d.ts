import { OperatorDto } from './operator.dto';
import { OperatorService } from './operator.service';
export declare class OperatorController {
    private readonly operatorService;
    constructor(operatorService: OperatorService);
    createOperator(operatorDto: OperatorDto): Promise<import("../interfaces").Operator>;
    updateOperator(operatorDto: OperatorDto): Promise<import("../interfaces").Operator>;
    updatePwd(operatorDto: OperatorDto): Promise<import("../interfaces").Operator>;
    list(page?: number, limit?: number, username?: string, email?: string): Promise<{
        data: import("../interfaces").Operator[];
        total: number;
    }>;
    getInfo(req: any): Promise<{
        id: string;
        username: string;
        nickname: string;
        email: string;
        createdAt: Date;
    }>;
}
