import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServerData } from './updateServerData.dto';
import { UpdateServerDataService } from './updateServerData.service';

@Controller('updateServerData')
export class updateServerDataController {
  constructor(
    private readonly updateServerDataService: UpdateServerDataService,
  ) {}

  @Post('/tokenTickers')
  async updateWholeTokenTickers() {
    
    this.updateServerDataService.deleteAllTokenTickers();
    let totalSavedTokenTickersCount = 0;
    for (let i = 0; i < 100; ++i) {
      const createdTokenTickers =
        await this.updateServerDataService.updateWholeTokenTickers();
      if(createdTokenTickers === undefined) break;
      totalSavedTokenTickersCount += createdTokenTickers.length;
    }
    return totalSavedTokenTickersCount;
  }
}
