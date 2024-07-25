import { TransfersService } from './transfers.service';
export declare class TransfersController {
    private readonly transfersService;
    constructor(transfersService: TransfersService);
    getTokenTransfers(chainId: string, addressHash: string, token: string): Promise<import("../interfaces").TransferItem[]>;
}
