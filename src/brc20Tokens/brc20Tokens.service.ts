import { Injectable } from '@nestjs/common';
import { Brc20TokenDto } from './brc20Token.dto';
import ECPairFactory, { ECPairAPI } from 'ecpair';
import * as dotenv from 'dotenv';
import { delay } from 'rxjs';
import * as bitcoin from 'bitcoinjs-lib';

const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { TokenTickerSchemaModel } from '@/schemas';

import { TokenTickerDocument } from '@/schemas/tokenTicker.schema';
import { transactionBuilder } from 'web3/lib/commonjs/eth.exports';
import { add } from 'winston';

dotenv.config();

// Define API credentials and project ids
const api_config = {
  api_key: process.env.OK_ACCESS_KEY,
  secret_key: '25787C65186DA8022EC3AD3790E5B9AC',
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
  // const timestamp = new Date(new Date().toUTCString()).toISOString();
  const timestamp = new Date().toISOString().slice(0, -5) + 'Z';

  // Generate a signature
  const message = preHash(timestamp, method, request_path, params);
  const signature = sign(message, api_config['secret_key']);
  return { signature, timestamp };
}

function sendGetRequest(request_path: string, params: any): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    // Generate a signature
    let { signature, timestamp } = createSignature('GET', request_path, params);

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

@Injectable()
export class Brc20TokensService {
  private readonly brc20Tokens: Brc20TokenDto[] = [];
  constructor(
    @InjectModel(TokenTickerSchemaModel.name)
    private readonly tokenTickerModel: Model<TokenTickerDocument>,
  ) {}

  async searchTokens(
    searchTerm: string,
    page: number,
    limit: number,
  ): Promise<any> {
    let getRequestPathForBTCPrice = '/api/v5/market/tickers';
    let getParamsForBTCPrice = {
      instType: 'SWAP',
      uly: 'BTC-USD',
    };
    let BTCPrice;
    try {
      const resultData = await sendGetRequest(
        getRequestPathForBTCPrice,
        getParamsForBTCPrice,
      );

      BTCPrice = resultData.data[0].last;
      //return resultData;
    } catch (error) {
      console.log('Error: ', error);
    }

    const regex = new RegExp(searchTerm, 'i');
    const skip = (page - 1) * limit;

    const tokenTickers = await this.tokenTickerModel
      .find({ slug: { $regex: regex } })
      .skip(skip)
      .limit(limit)
      .exec();

    let resultData_new = [];

    for (let i = 0; i < tokenTickers.length; ++i) {
      const tokenTicker = tokenTickers[i];
      //get inscription token lists
      let getRequestPath = '/api/v5/mktplace/nft/ordinals/collections';
      let getParams = {
        slug: tokenTicker.slug,
      };
      try {
        const resultData = await sendGetRequest(getRequestPath, getParams);
        //return resultData
        const eachToken = resultData.data.data[0];
        let getRequestPathForTransactionCount =
          '/api/v5/explorer/btc/token-list';
        let getParamsForTransactionCount = {
          token: eachToken.slug,
        };
        let resultWithTransactionCount = await sendGetReq(
          getRequestPathForTransactionCount,
          getParamsForTransactionCount,
        );

        const tokenWithTxCount =
          resultWithTransactionCount.data[0].tokenList[0];

        getRequestPath = '/api/v5/explorer/btc/token-details';
        let getParams3 = {
          token: eachToken.slug,
        };
        let newTokenWithLogo = await sendGetReq(getRequestPath, getParams3);

        let detailedToken = {};
        if (
          newTokenWithLogo.data !== undefined &&
          newTokenWithLogo.data[0] !== undefined
        )
          detailedToken = newTokenWithLogo.data[0];

        const curTimestamp = Math.floor(Date.now() / 3600000) * 3600000;

        let getRequestPathForChangeRate =
          '/api/v5/explorer/tokenprice/historical';
        let getParamsForChangeRate = {
          chainId: 0,
          tokenContractAddress: tokenWithTxCount.inscriptionId,
          limit: 31,
          after: curTimestamp,
          period: '1d',
        };
        const resultDataForChangeRate = await sendGetReq(
          getRequestPathForChangeRate,
          getParamsForChangeRate,
        );

        let oneDayRate = 0,
          sevenDaysRate = 0,
          thirtyDaysRate = 0;

        if (resultDataForChangeRate.data[0] !== undefined) {
          const prices = resultDataForChangeRate.data;
          oneDayRate =
            ((prices[0].price - prices[1].price) / prices[0].price) * 100;
          sevenDaysRate =
            ((prices[0].price - prices[7].price) / prices[0].price) * 100;
          thirtyDaysRate =
            ((prices[0].price - prices[30].price) / prices[0].price) * 100;
        }

        getRequestPath = '/api/v5/explorer/tokenprice/market-data';
        let getParams2 = {
          chainId: 0,
          tokenContractAddress: tokenWithTxCount.inscriptionId,
        };
        const marketData = await sendGetReq(getRequestPath, getParams2);

        let tokenWithMarket = {};
        if (marketData.data !== undefined && marketData.data[0] !== undefined)
          tokenWithMarket = marketData.data[0];

        resultData_new.push({
          ...eachToken, //First token
          ...tokenWithTxCount,
          ...detailedToken, // Detailed with logoUrl, precision and etc
          tokenContractAddress: tokenWithTxCount.inscriptionId, // tokenInscriptionId
          BTCPrice, // Bitcoin price at the moment
          ...tokenWithMarket, // 24h Volume, low, high ..
          oneDayRate,
          sevenDaysRate,
          thirtyDaysRate,
        });
        // await delay(100);
      } catch (error) {
        console.log('Error: ', error);
      }
    }
    return resultData_new;
  }

  async getInscriptionData(
    tokenSlug: string,
    page: string,
  ): Promise<any> {
    let postRequestUrl = '/api/v5/mktplace/nft/ordinals/listings';
    let postRequestParams = {
       slug: tokenSlug,
      // cursor: 'MTcxNzEyNjg2Njo0ODAwODE1NDM3',
       limit: 24
    };
    const resultData = await sendPostRequest(
      postRequestUrl,
      postRequestParams,
    );

    let inscriptions = JSON.parse(resultData).data.data;

    let inscArray = [];

    for(let i = 0; i < inscriptions.length; ++ i) {
      let eachIncription = inscriptions[i];
      let getRequestUrlForInscriptionNumber = "/api/v5/explorer/btc/inscriptions-list";
      let getRequestParamsForInscriptionNumber = {
        inscriptionId: eachIncription.inscriptionId
      }

      const resultWithInscriptionNumber = await sendGetReq(getRequestUrlForInscriptionNumber, getRequestParamsForInscriptionNumber);

      const inscriptionObjectForInscriptionNumber = resultWithInscriptionNumber.data[0].inscriptionsList[0];

      inscArray.push({...eachIncription, ...inscriptionObjectForInscriptionNumber});
    }  

    return inscArray;
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

  create(brc20TokenDto: Brc20TokenDto): void {
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

  async test(): Promise<any> {
    let postRequestPath = '/api/v5/explorer/tokenprice/historical';
    let postParams = {
      chainId: 0,
      period: '1m',
      limit: 10,
    };
    try {
      const resultData = await sendGetReq(postRequestPath, postParams);
      return resultData;
    } catch (e) {
      console.log(e);
    }

    // let postRequestPath = '/api/v5/mktplace/nft/ordinals/listings';
    // let postParams = {
    //   slug: 'ordi',
    //   limit: 100,
    // };
    // try {
    //   const resultData = await sendPostRequest(postRequestPath, postParams);
    //   return resultData;
    // } catch (e) {
    //   console.log(e);
    // }
  }

  // async brc20TokenDeploy(tokenDeployInfo: Object, address: string): Promise<any> {
  //   const batchTransactionURL = "api/v5/waas/transaction/send-transaction-batch";

  //   const unsignedCommitTx = {
  //     addrFrom: address,
  //     addrTo: address,
  //     txAmount: 0,
  //     chainId: 0,
  //     txType: 'BRC20_DEPLOY',
  //     extJson: {
  //       feeRate: 27,
  //       metadata: tokenDeployInfo,
  //     },
  //   } 
  //   const signedCommitTx = this.transactionSign(unsignedCommitTx);
  //   const unsignedRevealTx = {
  //     addrFrom: address,
  //     addrTo: address,
  //     txAmount: 0,
  //     chainId: 0,
  //     txType: 'BRC20_DEPLOY',
  //     extJson: {
  //       feeRate: 27,
  //       metadata: {
  //         p: 'brc-20',
  //         op: 'deploy',
  //         tick: 'tokb',
  //         max: '1000000000000000000',
  //         lim: '5',
  //       },
  //     },
  //   }
  //   const signedRevealTx = this.transactionSign(unsignedRevealTx);
  //   const batchTx = [
  //     {
  //       signedTx: signedCommitTx,
  //       walletId: "13886e05-1265-4b79-8ac3-b7ab46211004",
  //       addrFrom: address,
  //       addrTo: address,
  //       txHash: "cd09509cc602ea797c5d3218f36b401a6f21202470ea6e2ef98db71d48980e1f", //sdk wallet.calcTxHash
  //       txAmount: 0,
  //       chainId: 0,
  //       txType: "BRC20_DEPLOY",
  //       serviceCharge: 6468,
  //       tokenAddress: "",
  //       extJson: {
  //         broadcastType: 1,
  //         dependTx: [],
  //         feeRate: "27",
  //         itemId: "commitTx"
  //       }
  //     },
  //     {
  //       signedTx: signedRevealTx,
  //       walletId: "13886e05-1265-4b79-8ac3-b7ab46211004",
  //       addrFrom: address,
  //       addrTo: address,
  //       txHash: "64c89978eb7c1b9a197e2d86b49c2d025dc09f70b17bbb76894767e463a7cbec",
  //       txAmount: 0,
  //       chainId: 0,
  //       txType: "BRC20_DEPLOY",
  //       serviceCharge: 6468,
  //       tokenAddress: "",
  //       extJson: {
  //         "broadcastType": 1,
  //         // revealTx depends on the  commitTx
  //         "dependTx": [
  //           "cd09509cc602ea797c5d3218f36b401a6f21202470ea6e2ef98db71d48980e1f"
  //         ],
  //         "feeRate": "27",
  //         "itemId": "revealTx0"
  //       }
  //     }
  //   ];
  //   const commitResponse = await sendPostRequest(batchTransactionURL, batchTx);
  // }

  // async transactionSign(unsignedTxData: Object): Promise<any> {
  //   // const mainnet = bitcoin.networks.bitcoin;
  //   // const ECPair: ECPairAPI = ECPairFactory(ecc);
  //   // const privateKey = "";
  //   // const privateKeyWIF = ECPair.fromWIF(Buffer.from(privateKey, 'hex'), )
  //   // const txDatabuffer = Buffer.from(JSON.stringify(unsignedTxData));
  //   // const txData_Hex = txDatabuffer.toString('hex');
  //   // Example data
  //   const brc20Data = {
  //     p: "brc-20",
  //     op: "deploy",
  //     tick: "howd",
  //     max: "12000000",
  //     lim: "1232"
  //   };

  //   // Convert to OP_RETURN data
  //   const jsonData = JSON.stringify(brc20Data);
  //   const encodedData = Buffer.from(jsonData).toString('hex');
  //   const opReturnData = `6a${encodedData}`;

  //   // Create a transaction
    
  //   const txb = new bitcoin.Transaction();;
  //   txb.addInput('previous_txid_here', 0); // Replace with actual txid and vout
  //   txb.addOutput('recipient_bitcoin_address_here', 10000); // Regular output
  //   txb.addOutput(opReturnData, 0); // OP_RETURN output

  //   // Sign the transaction
  //   txb.sig // Replace with your WIF

  //   // Build and get the raw transaction hex
  //   const rawTx = txb.build().toHex();
  //   console.log('Raw Transaction:', rawTx);
  
  // }
}
 