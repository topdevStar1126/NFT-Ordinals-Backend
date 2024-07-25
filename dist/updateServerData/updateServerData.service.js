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
exports.UpdateServerDataService = void 0;
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
const https = require('https');
const crypto = require('crypto');
const querystring = require('querystring');
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
let UpdateServerDataService = class UpdateServerDataService {
    constructor(tokenTickerModel) {
        this.tokenTickerModel = tokenTickerModel;
    }
    deleteAllTokenTickers() {
        this.tokenTickerModel.deleteMany({}).exec();
    }
    async updateWholeTokenTickers() {
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
            const createdTokenTickers = await this.tokenTickerModel.create(tokenTickers.map((tokenTicer) => ({ slug: tokenTicer })));
            return createdTokenTickers;
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.UpdateServerDataService = UpdateServerDataService;
exports.UpdateServerDataService = UpdateServerDataService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.TokenTickerSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UpdateServerDataService);
//# sourceMappingURL=updateServerData.service.js.map