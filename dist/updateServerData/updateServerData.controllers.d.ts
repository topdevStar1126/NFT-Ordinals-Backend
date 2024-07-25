import { UpdateServerDataService } from './updateServerData.service';
export declare class updateServerDataController {
    private readonly updateServerDataService;
    constructor(updateServerDataService: UpdateServerDataService);
    updateWholeTokenTickers(): Promise<number>;
}
