import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { EthereumStrategy } from './ethereum.strategy';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private ethereumStrategy: EthereumStrategy,
  ) {}

  async login(user: any) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async challenge(req: any) {
    console.log("Services");
    
    return this.ethereumStrategy.challenge(req);
  }
}
