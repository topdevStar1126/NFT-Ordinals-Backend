import { Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Account, Balance } from '@/interfaces';
import { AccountSchemaModel } from '@/schemas';
import { AccountDocument } from '@/schemas/account.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(AccountSchemaModel.name)
    private readonly accountModel: Model<AccountDocument>,
  ) {}

  async getTokenList(
    chainId: string,
    addressHash: string,
  ): Promise<Array<Balance>> {
    let explorerUrls = {
      '813': 'https://qng.qitmeer.io',
      '8131': 'https://testnet-qng.qitmeer.io',
    };
    try {
      const resp = await fetch(
        `${explorerUrls[chainId]}/api?module=account&action=tokenlist&address=${addressHash}`,
      );
      const response = await resp.json();
      if (response.message === 'OK' && response.status === '1') {
        await this.accountModel.findOneAndUpdate(
          {
            chainId,
            addressHash,
          },
          {
            tokenList: response.result,
          },
          { upsert: true },
        );
      }
    } catch (error) {
      Logger.error(error);
    }
    const account = await this.accountModel.findOne({
      chainId,
      addressHash,
    });
    return account.tokenList as Array<Balance>;
  }
  /*
    async getTokenTransfers(chainId: string, addressHash: string): Promise<Array<Balance>> {
      let explorerUrls = {
        '813': 'https://qng.qitmeer.io',
        '8131': 'https://testnet-qng.qitmeer.io',
      };
      try {
        let tokenTransfers = [];
        let response;
        let blockNumber;
        let index;
        do {
          const resp = await fetch(`${explorerUrls[chainId]}/v2/addresses/${addressHash}/token-transfers?type=ERC-721&token=${address}&block_number=${blockNumber}&index=${index}`);
          response = await resp.json();
          tokenTransfers = tokenTransfers.concat(response.items);
        }
        while (response.next_page_params);
        await this.accountModel.findOneAndUpdate({
          chainId,
          addressHash: addressHash
        }, {
          tokenList: response.result
        }, { upsert: true });
      }
      catch (error) {
        Logger.error(error);
      }
      const account = await this.accountModel
        .findOne({
          chainId,
          addressHash: addressHash,
        });
      return account.tokenList as Array<Balance>;
    }*/
}
