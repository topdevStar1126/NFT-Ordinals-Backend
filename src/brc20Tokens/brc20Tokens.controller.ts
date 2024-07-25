import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { Brc20TokenDto } from './brc20Token.dto';
import { Brc20TokensService } from './brc20Tokens.service';

@Controller('brc20-tokens')
export class Brc20TokensController {
  constructor(private readonly brc20TokensService: Brc20TokensService) {}

  @Get('searchTokens')
  async searchTokens(
    @Query('search') searchTerm: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.brc20TokensService.searchTokens(searchTerm, page, limit);
  }

  @Get('/test')
  async test() {
    return this.brc20TokensService.test();
  }

  @Get('/getInscriptionData/:tokenSlug')
  async getInscriptionData(@Param('tokenSlug') tokenSlug) {
    return this.brc20TokensService.getInscriptionData(tokenSlug);
  }

  // @Post()
  // create(@Body() brc20TokenDto: Brc20TokenDto): void {
  //   this.brc20TokensService.create(brc20TokenDto);
  // }
}
