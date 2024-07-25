"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brc20TokensService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
dotenv.config();
const api_config = {
    api_key: process.env.OK_ACCESS_KEY,
    secret_key: '25787C65186DA8022EC3AD3790E5B9AC',
    passphrase: process.env.OK_ACCESS_PASSPHRASE,
    project: process.env.OK_ACCESS_PROJECT,
};
function preHash(timestamp, method, request_path, params) {
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
    const hmac = crypto.createHmac('sha256', secret_key);
    hmac.update(message);
    return hmac.digest('base64');
}
function createSignature(method, request_path, params) {
    const timestamp = new Date().toISOString().slice(0, -5) + 'Z';
    const message = preHash(timestamp, method, request_path, params);
    const signature = sign(message, api_config['secret_key']);
    return { signature, timestamp };
}
function sendGetRequest(request_path, params) {
    return new Promise((resolve, reject) => {
        let { signature, timestamp } = createSignature('GET', request_path, params);
        const headers = {
            'OK-ACCESS-KEY': api_config['api_key'],
            'OK-ACCESS-SIGN': signature,
            'OK-ACCESS-TIMESTAMP': timestamp,
            'OK-ACCESS-PASSPHRASE': api_config['passphrase'],
            'OK-ACCESS-PROJECT': api_config['project'],
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
function sendPostRequest(request_path, params) {
    return new Promise((resolve, reject) => {
        const { signature, timestamp } = createSignature('POST', request_path, params);
        const headers = {
            'OK-ACCESS-KEY': api_config['api_key'],
            'OK-ACCESS-SIGN': signature,
            'OK-ACCESS-TIMESTAMP': timestamp,
            'OK-ACCESS-PASSPHRASE': api_config['passphrase'],
            'OK-ACCESS-PROJECT': api_config['project'],
            'Content-Type': 'application/json',
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
function sendGetReq(request_path, params) {
    return new Promise((resolve, reject) => {
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
let Brc20TokensService = class Brc20TokensService {
    constructor(tokenTickerModel) {
        this.tokenTickerModel = tokenTickerModel;
        this.brc20Tokens = [];
    }
    async searchTokens(searchTerm, page, limit) {
        let getRequestPathForBTCPrice = '/api/v5/market/tickers';
        let getParamsForBTCPrice = {
            instType: 'SWAP',
            uly: 'BTC-USD',
        };
        let BTCPrice;
        try {
            const resultData = await sendGetRequest(getRequestPathForBTCPrice, getParamsForBTCPrice);
            BTCPrice = resultData.data[0].last;
        }
        catch (error) {
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
            let getRequestPath = '/api/v5/mktplace/nft/ordinals/collections';
            let getParams = {
                slug: tokenTicker.slug,
            };
            try {
                const resultData = await sendGetRequest(getRequestPath, getParams);
                const eachToken = resultData.data.data[0];
                let getRequestPathForTransactionCount = '/api/v5/explorer/btc/token-list';
                let getParamsForTransactionCount = {
                    token: eachToken.slug,
                };
                let resultWithTransactionCount = await sendGetReq(getRequestPathForTransactionCount, getParamsForTransactionCount);
                const tokenWithTxCount = resultWithTransactionCount.data[0].tokenList[0];
                getRequestPath = '/api/v5/explorer/btc/token-details';
                let getParams3 = {
                    token: eachToken.slug,
                };
                let newTokenWithLogo = await sendGetReq(getRequestPath, getParams3);
                let detailedToken = {};
                if (newTokenWithLogo.data !== undefined &&
                    newTokenWithLogo.data[0] !== undefined)
                    detailedToken = newTokenWithLogo.data[0];
                const curTimestamp = Math.floor(Date.now() / 3600000) * 3600000;
                let getRequestPathForChangeRate = '/api/v5/explorer/tokenprice/historical';
                let getParamsForChangeRate = {
                    chainId: 0,
                    tokenContractAddress: tokenWithTxCount.inscriptionId,
                    limit: 31,
                    after: curTimestamp,
                    period: '1d',
                };
                const resultDataForChangeRate = await sendGetReq(getRequestPathForChangeRate, getParamsForChangeRate);
                let oneDayRate = 0, sevenDaysRate = 0, thirtyDaysRate = 0;
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
                    ...eachToken,
                    ...tokenWithTxCount,
                    ...detailedToken,
                    tokenContractAddress: tokenWithTxCount.inscriptionId,
                    BTCPrice,
                    ...tokenWithMarket,
                    oneDayRate,
                    sevenDaysRate,
                    thirtyDaysRate,
                });
            }
            catch (error) {
                console.log('Error: ', error);
            }
        }
        return resultData_new;
    }
    async getInscriptionData(tokenSlug) {
        let postRequestUrl = '/api/v5/mktplace/nft/ordinals/listings';
        let postRequestParams = {
            slug: tokenSlug,
            limit: 24
        };
        const resultData = await sendPostRequest(postRequestUrl, postRequestParams);
        let inscriptions = JSON.parse(resultData).data.data;
        let inscArray = [];
        for (let i = 0; i < inscriptions.length; ++i) {
            let eachIncription = inscriptions[i];
            let getRequestUrlForInscriptionNumber = "/api/v5/explorer/btc/inscriptions-list";
            let getRequestParamsForInscriptionNumber = {
                inscriptionId: eachIncription.inscriptionId
            };
            const resultWithInscriptionNumber = await sendGetReq(getRequestUrlForInscriptionNumber, getRequestParamsForInscriptionNumber);
            const inscriptionObjectForInscriptionNumber = resultWithInscriptionNumber.data[0].inscriptionsList[0];
            inscArray.push({ ...eachIncription, ...inscriptionObjectForInscriptionNumber });
        }
        return inscArray;
    }
    async getTest() {
        let getRequestPath = '/api/v5/explorer/tokenprice/market-data';
        let getParams = {
            chainId: 0,
            tokenContractAddress: 'bc1pfku4w9trutsz6eyqw4h3xm5k4xdw4e2xt2lr3nm7esa86kttmgzsxswqke',
        };
        const resultData = await sendGetReq(getRequestPath, getParams);
        return resultData;
    }
    create(brc20TokenDto) {
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
    async test() {
        let postRequestPath = '/api/v5/explorer/tokenprice/historical';
        let postParams = {
            chainId: 0,
            period: '1m',
            limit: 10,
        };
        try {
            const resultData = await sendGetReq(postRequestPath, postParams);
            return resultData;
        }
        catch (e) {
            console.log(e);
        }
    }
};
exports.Brc20TokensService = Brc20TokensService;
exports.Brc20TokensService = Brc20TokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.TokenTickerSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], Brc20TokensService);
//# sourceMappingURL=brc20Tokens.service.js.map