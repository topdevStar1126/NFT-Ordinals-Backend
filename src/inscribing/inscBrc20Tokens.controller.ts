import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InscBrc20TokenDto } from './inscBrc20Token.dto';
import { InscBrc20TokensService } from './inscBrc20Tokens.service';

@Controller('inscBrc20')
export class InscBrc20TokensController {
  constructor(
    private readonly inscBrc20TokensService: InscBrc20TokensService,
  ) {}

  @Get()
  async findAll() {
    return this.inscBrc20TokensService.findAll();
  }

  @Get('/getInscriptionData/:tokenInscriptionId')
  async getInscriptionData(@Param('tokenInscriptionId') tokenInscriptionId) {
    return this.inscBrc20TokensService.getInscriptionData(tokenInscriptionId);
  }

  @Post()
  create(@Body() brc20TokenDto: InscBrc20TokenDto): void {
    this.inscBrc20TokensService.create(brc20TokenDto);
  }

  @Get('/tokenDeployed/:token')
  async getExistanceOfToken(@Param('token') token: string) {
    return this.inscBrc20TokensService.getExistanceOfToken(token);
  }

  @Get('/getMintRateOfToken/:token')
  async getMintrateOfToken(@Param('token') token: string) {
    return this.inscBrc20TokensService.getMintRateOfToken(token);
  }

  @Get('/test')
  async getTest() {
    return this.inscBrc20TokensService.getTest();
  }

  @Get('/getTokenNames/:keyWord')
  async getTokenNames(@Param('keyWord') keyWord: string) {
    return this.inscBrc20TokensService.getTokenNames(keyWord);
  }
}
