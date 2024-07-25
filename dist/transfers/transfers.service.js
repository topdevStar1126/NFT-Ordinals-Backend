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
exports.TransfersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
let TransfersService = class TransfersService {
    constructor(transferModel) {
        this.transferModel = transferModel;
    }
    async getTokenTransfers(chainId, addressHash, token) {
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
                blockNumber = response
                    ? response.next_page_params.block_number
                    : 'latest';
                index = response ? response.next_page_params.index : 0;
                const resp = await fetch(`${explorerUrls[chainId]}/api/v2/addresses/${addressHash}/token-transfers?type=ERC-721&token=${token}&block_number=${blockNumber}&index=${index}`);
                response = await resp.json();
                tokenTransfers = tokenTransfers.concat(response.items);
            } while (response.next_page_params);
            await this.transferModel.findOneAndUpdate({
                chainId,
                addressHash,
                token,
            }, {
                tokenTransfers,
            }, { upsert: true });
        }
        catch (error) {
            common_1.Logger.error(error);
        }
        const transfer = await this.transferModel.findOne({
            chainId,
            addressHash,
            token,
        });
        return transfer.tokenTransfers;
    }
};
exports.TransfersService = TransfersService;
exports.TransfersService = TransfersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.TransferSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], TransfersService);
//# sourceMappingURL=transfers.service.js.map