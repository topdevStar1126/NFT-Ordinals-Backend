import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login-siwe')
  @UseGuards(AuthGuard('ethereum'))
  login_siwe(@Req() req) {
    return this.authService.login(req.user);
  }

  @Post('login')
  @UseGuards(JwtAuthGuard)
  login(@Req() req) {
    return { success: true };
  }

  @Post('logout')
  logout(@Req() req) {
    delete req.session.user;
    req.session.save();
    return req.user;
  }

  @Post('challenge')
  challenge(@Req() req) {
    console.log("contorller");
    
    return this.authService.challenge(req);
  }
}
