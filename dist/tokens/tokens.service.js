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
exports.TokensService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
let TokensService = class TokensService {
    constructor(tokenModel) {
        this.tokenModel = tokenModel;
    }
    async getToken(chainId, contractAddress) {
        let explorerUrls = {
            '813': 'https://qng.qitmeer.io',
            '8131': 'https://testnet-qng.qitmeer.io',
        };
        try {
            const resp = await fetch(`${explorerUrls[chainId]}/api?module=token&action=getToken&contractaddress=${contractAddress}`);
            const response = await resp.json();
            if (response.message === 'OK' && response.status === '1') {
                const { cataloged, ...tokenData } = response.result;
                await this.tokenModel.findOneAndUpdate({
                    chainId,
                    contractAddress,
                }, tokenData, { upsert: true });
            }
        }
        catch (error) {
            common_1.Logger.error(error);
        }
        const token = await this.tokenModel.findOne({
            chainId,
            contractAddress,
        });
        return token;
    }
};
exports.TokensService = TokensService;
exports.TokensService = TokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.TokenSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TokensService);
//# sourceMappingURL=tokens.service.js.map