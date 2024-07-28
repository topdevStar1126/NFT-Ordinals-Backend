import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { TokenTickerSchemaModel } from '@/schemas';
import { TokenTickerDocument } from '@/schemas/tokenTicker.schema';
import { InscribingHistorySchemaModel } from '@/schemas';
import { InscribingHistoryDocument } from '@/schemas/inscribingHistory.schema';
import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { InscBrc20TokenDetailDto } from './inscBrc20TokenDetail.dto';
import { delay, min } from 'rxjs';
import { InscBrc20TokenDto } from './inscBrc20Token.dto';
import { InscribingHistoryDto } from './inscribingHistory.dto';

const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');

dotenv.config();

interface ApiConfig {
  api_key: string;
  passphrase: string;
  project: string;
}

// Define API credentials and project ids
const api_config = {
  api_key: process.env.OK_ACCESS_KEY,
  secret_key: process.env.OK_SECRET_KEY,
  passphrase: process.env.OK_ACCESS_PASSPHRASE,
  project: process.env.OK_ACCESS_PROJECT, // This applies only to WaaS APIs
};

function preHash(timestamp, method, request_path, params) {
  // Create a pre-signature based on strings and parameters
  let query_string = '';
  if (method === 'GET' && params) {
    query_string = '?' + querystring.stringify(params);
  }
  if (method === 'POST' && params) {
    query_string = JSON.stringify(params);
  }
  return timestamp + method + request_path + query_string;
}

function sign(message, secret_key) {
  // Use HMAC-SHA256 to sign the pre-signed string
  const hmac = crypto.createHmac('sha256', secret_key);
  hmac.update(message);
  return hmac.digest('base64');
}

function createSignature(method, request_path, params) {
  // Get the timestamp in ISO 8601 format
  const timestamp =
    new Date(new Date().toUTCString()).toISOString().slice(0, -5) + 'Z';
  // Generate a signature
  const message = preHash(timestamp, method, request_path, params);
  const signature = sign(message, api_config['secret_key']);
  return { signature, timestamp };
}

function sendGetRequest(request_path: string, params: any): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    // Generate a signature
    const { signature, timestamp } = createSignature(
      'GET',
      request_path,
      params,
    );

    // const timestamp = new Date(new Date().toUTCString()).getTime();

    // Generate the request header
    const headers = {
      'OK-ACCESS-KEY': api_config['api_key'],
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': api_config['passphrase'],
      'OK-ACCESS-PROJECT': api_config['project'], // This applies only to WaaS APIs
    };

    const options = {
      hostname: 'www.okx.com',
      path: request_path + (params ? `?${querystring.stringify(params)}` : ''),
      method: 'GET',
      headers: headers,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
        return data;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      reject(error); //// Reject the promise if an error occurs while fetching brc20Token data
    });

    req.end();
  });
}

function sendGetReq(request_path: string, params: any): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    // Generate the request header
    const headers = {
      'OK-ACCESS-KEY': process.env.OK_ACCESS_KEY_2,
    };

    const options = {
      hostname: 'www.oklink.com',
      path: request_path + (params ? `?${querystring.stringify(params)}` : ''),
      method: 'GET',
      headers: headers,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
        return data;
      });
      res.on('end', () => {
        resolve(JSON.parse(data));
      });
    });

    req.on('error', (error) => {
      reject(error); //// Reject the promise if an error occurs while fetching brc20Token data
    });

    req.end();
  });
}

function sendPostRequest(request_path: string, params: any): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    // Generate a signature
    const { signature, timestamp } = createSignature(
      'POST',
      request_path,
      params,
    );

    // Generate the request header
    const headers = {
      'OK-ACCESS-KEY': api_config['api_key'],
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': api_config['passphrase'],
      'OK-ACCESS-PROJECT': api_config['project'], // This applies only to WaaS APIs
      'Content-Type': 'application/json', // POST requests need this header
    };

    const options = {
      hostname: 'www.okx.com',
      path: request_path,
      method: 'POST',
      headers: headers,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(data);
        resolve(data); ////  Resolve the promise with the brc20Token data
      });
    });

    req.on('error', (error) => {
      reject(error); //// Reject the promise if an error occurs while fetching brc20Token data
    });

    if (params) {
      req.write(JSON.stringify(params));
    }

    req.end();
  });
}

@Injectable()
export class InscBrc20TokensService {
  private readonly brc20Tokens: InscBrc20TokenDto[] = [];

  constructor(
    @InjectModel(TokenTickerSchemaModel.name)
    private readonly tokenTickerModel: Model<TokenTickerDocument>,
    @InjectModel(InscribingHistorySchemaModel.name)
    private readonly inscribingHistoryModel: Model<InscribingHistoryDocument>
  ) {}

  async findAll_tokenList(): Promise<InscBrc20TokenDto[]> {
    // GET brc20Tokens
    let getRequestPath = '/api/v5/explorer/brc20/token-list';
    let getParams = {
      // orderBy: "deployTimeDesc",
      page: 1,
      limit: 20,
    };
    try {
      const resultData = await sendGetRequest(getRequestPath, getParams);
      const tokenList = resultData.data[0].tokenList;
      console.log(tokenList);

      return tokenList;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async fetchTokenDetails(pageTokens: any) {
    const tokenDetails = [];

    pageTokens.forEach(async (eachToken, index) => {
      const result = await sendGetReq('/api/v5/explorer/btc/token-details', {
        token: eachToken.symbol,
      });

      if (!result.isError) {
        console.log(result);

        tokenDetails.push(result);
      } else {
        console.log(result.isError);
      }
    });

    return tokenDetails;
  }

  async findAll(): Promise<any> {
    //get inscription token lists
    let getRequestPath = '/api/v5/explorer/inscription/token-list';
    let getParams = {
      chainShortName: 'BTC',
      protocolType: 'brc20',
      page: 1,
      limit: 20,
    };
    try {
      const resultData = await sendGetReq(getRequestPath, getParams);
      const tokenList = resultData.data[0].tokenList;
      let resultData_new = [];
      for (let eachToken of tokenList) {
        getRequestPath = '/api/v5/explorer/btc/token-details';
        let getParams3 = {
          token: eachToken.symbol,
        };
        let newTokenWithLogo = await sendGetReq(getRequestPath, getParams3);
        if (newTokenWithLogo.data[0] === undefined) continue;
        const logoUrl = newTokenWithLogo.data[0].logoUrl;
        getRequestPath = '/api/v5/explorer/tokenprice/token-list';
        let getParams = {
          token: eachToken.symbol,
        };
        const tmpTokenListWithContract = await sendGetReq(
          getRequestPath,
          getParams,
        );
        if (tmpTokenListWithContract.data[0] === undefined) continue;
        const networkList = tmpTokenListWithContract.data[0].tokenList;
        let thisTokenContractAddress = '';
        for (let eachNetwork of networkList) {
          if (eachNetwork.network[0].chainId === '0') {
            thisTokenContractAddress =
              eachNetwork.network[0].tokenContractAddress;
            break;
          }
        }

        getRequestPath = '/api/v5/explorer/tokenprice/market-data';
        let getParams2 = {
          chainId: 0,
          tokenContractAddress: thisTokenContractAddress,
        };
        const marketData = await sendGetReq(getRequestPath, getParams2);

        resultData_new.push({
          ...eachToken,
          logoUrl,
          tokenContractAddress: thisTokenContractAddress,
          ...marketData.data[0],
        });
        await delay(100);
      }

      // const tokenDetails = await this.fetchTokenDetails(tokenList);
      // console.log(tokenDetails);

      // console.log(resultData_new);

      return resultData_new;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async getInscriptionData(tokenInscriptionId: string): Promise<any> {
    //get inscription token lists
    let getRequestPath = '/api/v5/explorer/inscription/inscription-list';
    getRequestPath = '/api/v5/explorer/inscription/token-transaction-list';
    let getParams = {
      chainShortName: 'BTC',
      protocolType: 'brc20',
      tokenInscriptionId,
      page: 23,
      limit: 50,
    };
    try {
      const resultData = await sendGetReq(getRequestPath, getParams);
      let tokenList = resultData.data[0];
      tokenList = resultData.data[0].transactionList;
      // const tokenDetails = await this.fetchTokenDetails(tokenList);
      // console.log(tokenDetails);
      const newInscription = tokenList.filter((eachInscriptionData, index) => {
        return eachInscriptionData.action === 'inscribeTransfer';
      });
      const resultHistoricalPriceAdded = [];
      for (let eachInscriptionData of newInscription) {
        const hisGetRequestPath = '/api/v5/explorer/tokenprice/historical';
        const hisGetParams = {
          chainId: 0,
          tokenContractAddress: eachInscriptionData.tokenContractAddress,
          after: 1716307200000,
          limit: 1,
          period: '1m',
        };
        const hisPrice = await sendGetReq(hisGetRequestPath, hisGetParams);
        resultHistoricalPriceAdded.push({
          ...eachInscriptionData,
          priceATM: hisPrice.data[0].price,
        });

        await delay(100);
      }
      for (let eachInscriptionData of tokenList) {
        getRequestPath = '/api/v5/explorer/inscription/token-transaction-list';
        let getParamsForIns = {
          chainShortName: 'BTC',
          protocolType: 'brc20',
          tokenInscriptionId: eachInscriptionData.tokenInscriptionId,
          symbol: eachInscriptionData.symbol,
        };
        // const resultForIns = await sendGetReq(getRequestPath, getParamsForIns);
        // console.log(resultForIns.data[0].transactionList);
        // await delay(1000);
      }

      return resultHistoricalPriceAdded;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async getExistanceOfToken(token: string): Promise<any> {
    let getRequestPathForExistanceOfToken =
      '/api/v5/explorer/btc/token-details';
    let getRequestParamsForExistanceOfToken = {
      // chainId: 0,
      // tokenContractAddress: newToken.data[0].deployAddress,
      token: token,
    };
    const tokenDetail = await sendGetReq(
      getRequestPathForExistanceOfToken,
      getRequestParamsForExistanceOfToken,
    );
    return tokenDetail.data.length;
    // // GET brc20Tokens TEST
    // let getRequestPath = '/api/v5/explorer/brc20/token-details';
    // let getParams = {
    //   token,
    // };
    // try {
    //   const resultData = await sendGetRequest(getRequestPath, getParams);
    //   return resultData;
    // } catch (error) {
    //   console.log('Error: ', error);
    // }
  }

  async getMintRateOfToken(token: string): Promise<any> {
    let getRequestPathForExistanceOfToken =
      '/api/v5/explorer/btc/token-details';
    let getRequestParamsForExistanceOfToken = {
      // chainId: 0,
      // tokenContractAddress: newToken.data[0].deployAddress,
      token: token,
    };
    const tokenDetailRes = await sendGetReq(
      getRequestPathForExistanceOfToken,
      getRequestParamsForExistanceOfToken,
    );
    if (!tokenDetailRes.data.length) return 0;
    const tokenDetail = tokenDetailRes.data[0];
    const totalSupply = tokenDetail.totalSupply;
    const mintAmount = tokenDetail.mintAmount;
    return (mintAmount * 100) / totalSupply;
    // // GET brc20Tokens TEST
    // let getRequestPath = '/api/v5/explorer/brc20/token-details';
    // let getParams = {
    //   token,
    // };
    // try {
    //   const resultData = await sendGetRequest(getRequestPath, getParams);
    //   return resultData;
    // } catch (error) {
    //   console.log('Error: ', error);
    // }
  }

  async getTest(): Promise<any> {
    let getRequestPath = '/api/v5/explorer/tokenprice/market-data';
    let getParams = {
      chainId: 0,
      tokenContractAddress:
        'bc1pfku4w9trutsz6eyqw4h3xm5k4xdw4e2xt2lr3nm7esa86kttmgzsxswqke',
      // page: 1,
      // limit: 5,
    };
    const resultData = await sendGetReq(getRequestPath, getParams);
    return resultData;
    // GET brc20Tokens TEST
    // let getRequestPath = '/api/v5/explorer/inscription/token-list';
    // let getParams = {
    //   chainShortName: 'btc',
    //   protocolType: 'brc20',
    // };
    // try {
    //   const resultData = await sendGetRequest(getRequestPath, getParams);
    //   return resultData;
    // } catch (error) {
    //   console.log('Error: ', error);
    // }
  }

  create(brc20TokenDto: InscBrc20TokenDto): void {
    // POST
    // create a brc20Token
    const postRequestPath = '/api/v5/mktplace/nft/ordinals/listings';
    const postParams = {
      slug: 'sats',
    };
    sendPostRequest(postRequestPath, postParams)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log('Error: ', error);
      });
    this.brc20Tokens.push(brc20TokenDto);
  }

  async getTokenNames(keyWord: string): Promise<any> {
    const regex = new RegExp(keyWord, 'i');

    let result = [];
    const tokenTickers = await this.tokenTickerModel
      .find({ slug: { $regex: regex } })
      .limit(20)
      .exec();
    for(let i = 0; i < tokenTickers.length; i ++) {
      let mintedRate = await this.getMintRateOfToken(tokenTickers[i].slug);
      result.push({
        slug: tokenTickers[i].slug,
        mintedRate: mintedRate
      })
    }

    return result;
  }

  async getInscribingHistory(recipientAddress: string): Promise<any> {
    const regex = new RegExp(recipientAddress, 'i');

    const tokenTickers = await this.inscribingHistoryModel
      .find({ recipientAddress: { $regex: regex } })
      .limit(30)
      .exec();

    return tokenTickers;
  }
  async createInscribingHistory(createItemDto: InscribingHistoryDto): Promise<any> {
    const newItem = await this.inscribingHistoryModel.create({
      type: createItemDto.type,
      status: createItemDto.status,
      networkFee: createItemDto.networkFee,
      paymentAddress: createItemDto.paymentAddress,
      recipientAddress: createItemDto.recipientAddress,
      createdAt: new Date()
    })

    return newItem;
  }
}
