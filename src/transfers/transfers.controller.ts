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
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get('/:chainId/:addressHash/:token')
  getTokenTransfers(
    @Param('chainId') chainId: string,
    @Param('addressHash') addressHash: string,
    @Param('token') token: string,
  ) {
    return this.transfersService.getTokenTransfers(
      chainId,
      addressHash.toLowerCase(),
      token.toLowerCase(),
    );
  }
}
