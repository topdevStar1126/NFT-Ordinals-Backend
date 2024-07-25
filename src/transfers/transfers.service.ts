import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transfer, TransferItem } from '@/interfaces';
import { TransferSchemaModel } from '@/schemas';
import { TransferDocument } from '@/schemas/transfer.schema';

@Injectable()
export class TransfersService {
  constructor(
    @InjectModel(TransferSchemaModel.name)
    private readonly transferModel: Model<TransferDocument>,
  ) {}

  async getTokenTransfers(
    chainId: string,
    addressHash: string,
    token: string,
  ): Promise<Array<TransferItem>> {
    let explorerUrls = {
      '813': 'https://qng.qitmeer.io',
      '8131': 'https://testnet-qng.qitmeer.io',
    };
    try {
      let tokenTransfers = [];
      let response: any;
      let blockNumber: number;
      let index: number;
      do {
        blockNumber = response
          ? response.next_page_params.block_number
          : 'latest';
        index = response ? response.next_page_params.index : 0;
        const resp = await fetch(
          `${explorerUrls[chainId]}/api/v2/addresses/${addressHash}/token-transfers?type=ERC-721&token=${token}&block_number=${blockNumber}&index=${index}`,
        );
        response = await resp.json();
        tokenTransfers = tokenTransfers.concat(response.items);
      } while (response.next_page_params);
      await this.transferModel.findOneAndUpdate(
        {
          chainId,
          addressHash,
          token,
        },
        {
          tokenTransfers,
        },
        { upsert: true },
      );
    } catch (error) {
      Logger.error(error);
    }
    const transfer = await this.transferModel.findOne({
      chainId,
      addressHash,
      token,
    });
    return transfer.tokenTransfers as Array<TransferItem>;
  }
}
