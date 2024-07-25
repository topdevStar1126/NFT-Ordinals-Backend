import { AppService } from 'src/app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    healthCheck(): string;
}
