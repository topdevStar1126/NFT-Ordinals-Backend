import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateListingsDto } from './createListings.dto';
import { CreateListingsService } from './createListings.service';

@Controller('create-listings')
export class CreateListingsController {
  constructor(private readonly createListingsService: CreateListingsService) {}

  @Get('getValidInscription')
  async getValidInscription() {
    return this.createListingsService.getValidInscription();
  }

  @Get('/test')
  async test() {
    return this.createListingsService.test();
  }

  @Get('/getInscriptionData/:tokenSlug')
  async getInscriptionData(@Param('tokenSlug') tokenSlug) {
    return this.createListingsService.getInscriptionData(tokenSlug);
  }
}
