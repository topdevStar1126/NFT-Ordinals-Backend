import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  UnauthorizedException,
  Logger,
  Res,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/auth.guard';
import { Public } from '@/auth/auth.decorator';
import { JwtStrategy } from '@/auth/jwt.strategy';
import { verify } from 'jsonwebtoken';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':wallet')
  async findOne(@Req() req, @Param('wallet') wallet: string) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const payload = verify(token, process.env.JWT_SECRET);
        req.user = payload;
      } catch (error) {
        Logger.error(error);
      }
    }
    const user = req.user;
    return this.usersService.findOne(user?.address.toLowerCase() ?? "", wallet.toLowerCase());
  }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body('email') email: string, @Res() res: Response) {
    try {
      await this.usersService.sendVerificationEmail(email);
      return {success: true, data: 'Email sent.'}
    } catch (error) {
      return {success: false, data: 'Error'}
    }
  }

  @Post('verify-code')
  verifyCode(
    @Body('email') email: string,
    @Body('code') code: string,
    @Res() res: Response,
  ) {
    if (this.usersService.verifyCode(email, code)) {
      return true;
    } else {
      return false;
    }
  }

  @Patch(':wallet')
  @UseGuards(JwtAuthGuard)
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user;
    return this.usersService.update(user.address, updateUserDto);
  }
}
