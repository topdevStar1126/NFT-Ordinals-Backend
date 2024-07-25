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
exports.InscBrc20TokensService = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const rxjs_1 = require("rxjs");
const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');
dotenv.config();
const api_config = {
    api_key: process.env.OK_ACCESS_KEY,
    secret_key: process.env.OK_SECRET_KEY,
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
    const timestamp = new Date(new Date().toUTCString()).toISOString().slice(0, -5) + 'Z';
    const message = preHash(timestamp, method, request_path, params);
    const signature = sign(message, api_config['secret_key']);
    return { signature, timestamp };
}
function sendGetRequest(request_path, params) {
    return new Promise((resolve, reject) => {
        const { signature, timestamp } = createSignature('GET', request_path, params);
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
                console.log(data);
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
let InscBrc20TokensService = class InscBrc20TokensService {
    constructor(tokenTickerModel) {
        this.tokenTickerModel = tokenTickerModel;
        this.brc20Tokens = [];
    }
    async findAll_tokenList() {
        let getRequestPath = '/api/v5/explorer/brc20/token-list';
        let getParams = {
            page: 1,
            limit: 20,
        };
        try {
            const resultData = await sendGetRequest(getRequestPath, getParams);
            const tokenList = resultData.data[0].tokenList;
            console.log(tokenList);
            return tokenList;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }
    async fetchTokenDetails(pageTokens) {
        const tokenDetails = [];
        pageTokens.forEach(async (eachToken, index) => {
            const result = await sendGetReq('/api/v5/explorer/btc/token-details', {
                token: eachToken.symbol,
            });
            if (!result.isError) {
                console.log(result);
                tokenDetails.push(result);
            }
            else {
                console.log(result.isError);
            }
        });
        return tokenDetails;
    }
    async findAll() {
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
                if (newTokenWithLogo.data[0] === undefined)
                    continue;
                const logoUrl = newTokenWithLogo.data[0].logoUrl;
                getRequestPath = '/api/v5/explorer/tokenprice/token-list';
                let getParams = {
                    token: eachToken.symbol,
                };
                const tmpTokenListWithContract = await sendGetReq(getRequestPath, getParams);
                if (tmpTokenListWithContract.data[0] === undefined)
                    continue;
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
                await (0, rxjs_1.delay)(100);
            }
            return resultData_new;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }
    async getInscriptionData(tokenInscriptionId) {
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
                await (0, rxjs_1.delay)(100);
            }
            for (let eachInscriptionData of tokenList) {
                getRequestPath = '/api/v5/explorer/inscription/token-transaction-list';
                let getParamsForIns = {
                    chainShortName: 'BTC',
                    protocolType: 'brc20',
                    tokenInscriptionId: eachInscriptionData.tokenInscriptionId,
                    symbol: eachInscriptionData.symbol,
                };
            }
            return resultHistoricalPriceAdded;
        }
        catch (error) {
            console.log('Error: ', error);
        }
    }
    async getExistanceOfToken(token) {
        let getRequestPathForExistanceOfToken = '/api/v5/explorer/btc/token-details';
        let getRequestParamsForExistanceOfToken = {
            token: token,
        };
        const tokenDetail = await sendGetReq(getRequestPathForExistanceOfToken, getRequestParamsForExistanceOfToken);
        return tokenDetail.data.length;
    }
    async getMintRateOfToken(token) {
        let getRequestPathForExistanceOfToken = '/api/v5/explorer/btc/token-details';
        let getRequestParamsForExistanceOfToken = {
            token: token,
        };
        const tokenDetailRes = await sendGetReq(getRequestPathForExistanceOfToken, getRequestParamsForExistanceOfToken);
        if (!tokenDetailRes.data.length)
            return 0;
        const tokenDetail = tokenDetailRes.data[0];
        const totalSupply = tokenDetail.totalSupply;
        const mintAmount = tokenDetail.mintAmount;
        return (mintAmount * 100) / totalSupply;
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
    async getTokenNames(keyWord) {
        const regex = new RegExp(keyWord, 'i');
        const tokenTickers = await this.tokenTickerModel
            .find({ slug: { $regex: regex } })
            .limit(20)
            .exec();
        return tokenTickers;
    }
};
exports.InscBrc20TokensService = InscBrc20TokensService;
exports.InscBrc20TokensService = InscBrc20TokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.TokenTickerSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], InscBrc20TokensService);
//# sourceMappingURL=inscBrc20Tokens.service.js.map