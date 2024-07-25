import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from '@/interfaces';
import { TokenSchemaModel } from '@/schemas';
import { TokenDocument } from '@/schemas/token.schema';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(TokenSchemaModel.name)
    private readonly tokenModel: Model<TokenDocument>,
  ) {}

  async getToken(chainId: string, contractAddress: string): Promise<Token> {
    let explorerUrls = {
      '813': 'https://qng.qitmeer.io',
      '8131': 'https://testnet-qng.qitmeer.io',
    };
    try {
      const resp = await fetch(
        `${explorerUrls[chainId]}/api?module=token&action=getToken&contractaddress=${contractAddress}`,
      );
      const response = await resp.json();
      if (response.message === 'OK' && response.status === '1') {
        const { cataloged, ...tokenData } = response.result;
        await this.tokenModel.findOneAndUpdate(
          {
            chainId,
            contractAddress,
          },
          tokenData,
          { upsert: true },
        );
      }
    } catch (error) {
      Logger.error(error);
    }
    const token = await this.tokenModel.findOne({
      chainId,
      contractAddress,
    });
    return token as Token;
  }
}
