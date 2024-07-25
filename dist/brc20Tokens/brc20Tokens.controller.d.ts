import { Brc20TokensService } from './brc20Tokens.service';
export declare class Brc20TokensController {
    private readonly brc20TokensService;
    constructor(brc20TokensService: Brc20TokensService);
    searchTokens(searchTerm: string, page?: number, limit?: number): Promise<any>;
    test(): Promise<any>;
    getInscriptionData(tokenSlug: any): Promise<any>;
}
