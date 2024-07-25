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
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('/:chainId/:addressHash')
  getTokenList(
    @Param('chainId') chainId: string,
    @Param('addressHash') addressHash: string,
  ) {
    return this.accountsService.getTokenList(
      chainId,
      addressHash.toLowerCase(),
    );
  }
}
