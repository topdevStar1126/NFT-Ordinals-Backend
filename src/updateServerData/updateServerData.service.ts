import { Injectable } from '@nestjs/common';
import { ServerData } from './updateServerData.dto';

import * as dotenv from 'dotenv';
import { delay } from 'rxjs';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { TokenTickerSchemaModel } from '@/schemas';

import { TokenTickerDocument } from '@/schemas/tokenTicker.schema';

const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');

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
export class UpdateServerDataService {
  constructor(
    @InjectModel(TokenTickerSchemaModel.name)
    private readonly tokenTickerModel: Model<TokenTickerDocument>,
  ) {}

  private readonly serverData: ServerData;

  deleteAllTokenTickers() {
    this.tokenTickerModel.deleteMany({}).exec();
  }

  async updateWholeTokenTickers(): Promise<any> {
    let getRequestPath = '/api/v5/mktplace/nft/ordinals/collections';
    let getParams = {
      limit: 100,
    };
    try {
      const resultData = await sendGetRequest(getRequestPath, getParams);
      const tokenList = resultData.data.data;
      const tokenTickers = tokenList.map((eachToken) => {
        return eachToken.slug;
      });
      const createdTokenTickers = await this.tokenTickerModel.create(
        tokenTickers.map((tokenTicer) => ({ slug: tokenTicer })),
      );
      return createdTokenTickers;
    } catch (error) {
      console.error(error);
    }
  }
}
