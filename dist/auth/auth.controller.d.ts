import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login_siwe(req: any): Promise<{
        access_token: string;
    }>;
    login(req: any): {
        success: boolean;
    };
    logout(req: any): any;
    challenge(req: any): Promise<unknown>;
}
