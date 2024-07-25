import { TokensService } from './tokens.service';
export declare class TokensController {
    private readonly tokensService;
    constructor(tokensService: TokensService);
    getToken(chainId: string, contractAddress: string): Promise<import("../interfaces").Token>;
}
