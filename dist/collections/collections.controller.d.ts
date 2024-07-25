import { CreateCollectionDto, UpdateCollectionDto } from './collections.dto';
import { CollectionsService } from './collections.service';
export declare class CollectionsController {
    private readonly collectionsService;
    constructor(collectionsService: CollectionsService);
    create(req: any, createCollectionDto: CreateCollectionDto): Promise<import("../interfaces").Collection>;
    findAll(): Promise<import("../interfaces").Collection[]>;
    findAllByChainId(chainId: number): Promise<import("../interfaces").Collection[]>;
    findOne(chainId: number, address: string): Promise<import("../interfaces").Collection>;
    update(req: any, chainId: number, address: string, updateCollectionDto: UpdateCollectionDto): Promise<import("../interfaces").Collection>;
}
