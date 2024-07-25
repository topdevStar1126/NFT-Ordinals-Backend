import { InscBrc20TokenDto } from './inscBrc20Token.dto';
import { InscBrc20TokensService } from './inscBrc20Tokens.service';
export declare class InscBrc20TokensController {
    private readonly inscBrc20TokensService;
    constructor(inscBrc20TokensService: InscBrc20TokensService);
    findAll(): Promise<any>;
    getInscriptionData(tokenInscriptionId: any): Promise<any>;
    create(brc20TokenDto: InscBrc20TokenDto): void;
    getExistanceOfToken(token: string): Promise<any>;
    getMintrateOfToken(token: string): Promise<any>;
    getTest(): Promise<any>;
    getTokenNames(keyWord: string): Promise<any>;
}
