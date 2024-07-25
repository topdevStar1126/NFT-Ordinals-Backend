import { JwtService } from '@nestjs/jwt';
import { EthereumStrategy } from './ethereum.strategy';
export declare class AuthService {
    private jwtService;
    private ethereumStrategy;
    constructor(jwtService: JwtService, ethereumStrategy: EthereumStrategy);
    login(user: any): Promise<{
        access_token: string;
    }>;
    challenge(req: any): Promise<unknown>;
}
