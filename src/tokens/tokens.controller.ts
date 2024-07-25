import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get('/:chainId/:contractAddress')
  getToken(
    @Param('chainId') chainId: string,
    @Param('contractAddress') contractAddress: string,
  ) {
    return this.tokensService.getToken(chainId, contractAddress.toLowerCase());
  }
}
