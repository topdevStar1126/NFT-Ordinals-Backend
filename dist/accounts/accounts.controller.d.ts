import { AccountsService } from './accounts.service';
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    getTokenList(chainId: string, addressHash: string): Promise<import("../interfaces").Balance[]>;
}
