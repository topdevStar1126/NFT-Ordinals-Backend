import { Injectable } from '@nestjs/common';
import { CreateListingsDto } from './createListings.dto';

import * as dotenv from 'dotenv';
import { delay } from 'rxjs';

const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { TokenTickerSchemaModel } from '@/schemas';

import { TokenTickerDocument } from '@/schemas/tokenTicker.schema';

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
      reject(error); 
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
        resolve(data); 
      });
    });

    req.on('error', (error) => {
      reject(error); 
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
      reject(error); 
    });

    req.end();
  });
}

@Injectable()
export class CreateListingsService {
  constructor(
    @InjectModel(TokenTickerSchemaModel.name)
    private readonly tokenTickerModel: Model<TokenTickerDocument>,
  ) {}

  async getValidInscription() : Promise<any> {
    let postRequestUrl = '/api/v5/mktplace/nft/ordinals/get-valid-inscriptions';
    let postRequestParams = {
      slug: "ordi",
      limit: 20,
      walletAddress: "bc1pcw99cualpep26w0pf0dm0v6zy0aw0tp4snxfadtv425dvsqq365s6mz0mp"
    };
    const resultData = await sendPostRequest(
      postRequestUrl,
      postRequestParams,
    );

    // let inscriptions = JSON.parse(resultData).data.data;

    // let inscArray = [];

    // for(let i = 0; i < inscriptions.length; ++ i) {
    //   let eachIncription = inscriptions[i];
    
    //   inscArray.push({...eachIncription});


    // }
    return resultData;
  }

  async getInscriptionData(tokenSlug: string): Promise<any> {
    let postRequestUrl = '/api/v5/mktplace/nft/ordinals/get-valid-inscriptions';
    let postRequestParams = {
      slug: "ordi",
      limit: 24,
      walletAddress: "bc1pcw99cualpep26w0pf0dm0v6zy0aw0tp4snxfadtv425dvsqq365s6mz0mp"
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
    };
    const resultData = await sendGetReq(getRequestPath, getParams);
    return resultData;
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
  }
}
