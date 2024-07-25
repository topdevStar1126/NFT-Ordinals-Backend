import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateCollectionDto, UpdateCollectionDto } from './collections.dto';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '@/auth/auth.guard';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req, @Body() createCollectionDto: CreateCollectionDto) {
    const user = req.user;
    return this.collectionsService.create(user.address, createCollectionDto);
  }

  @Get('')
  findAll() {
    return this.collectionsService.findAll();
  }

  @Get('/:chainId')
  findAllByChainId(@Param('chainId') chainId: number) {
    return this.collectionsService.findAllByChainId(chainId);
  }

  @Get('/:chainId/:address')
  findOne(
    @Param('chainId') chainId: number,
    @Param('address') address: string,
  ) {
    return this.collectionsService.findOne(chainId, address.toLowerCase());
  }

  @Patch('/:chainId/:address')
  @UseGuards(JwtAuthGuard)
  update(
    @Req() req,
    @Param('chainId') chainId: number,
    @Param('address') address: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    const user = req.user;
    return this.collectionsService.update(
      user.address,
      chainId,
      address.toLowerCase(),
      updateCollectionDto,
    );
  }
}
