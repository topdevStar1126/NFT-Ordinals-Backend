import { CreateListingsService } from './createListings.service';
export declare class CreateListingsController {
    private readonly createListingsService;
    constructor(createListingsService: CreateListingsService);
    getValidInscription(): Promise<any>;
    test(): Promise<any>;
    getInscriptionData(tokenSlug: any): Promise<any>;
}
