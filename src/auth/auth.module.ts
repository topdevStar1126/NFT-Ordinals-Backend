import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { EthereumStrategy } from './ethereum.strategy';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY_TIME },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EthereumStrategy, JwtStrategy],
})
export class AuthModule { }
