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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_ethereum_siwe_1 = require("passport-ethereum-siwe");
let EthereumStrategy = class EthereumStrategy extends (0, passport_1.PassportStrategy)(passport_ethereum_siwe_1.Strategy) {
    constructor() {
        const store = new passport_ethereum_siwe_1.SessionNonceStore();
        super({ store });
        this.store = store;
        console.log(store);
    }
    async validate(address) {
        return { address };
    }
    challenge(req) {
        console.log("ethereum.strategy");
        return new Promise((resolve, reject) => {
            this.store.challenge(req, (err, nonce) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                else {
                    console.log("SSSSSSUUUUUCCCCCCCCCCCCCCCEEEESSSSSSSSSSSSSSS");
                    return resolve({ nonce });
                }
            });
        });
    }
};
exports.EthereumStrategy = EthereumStrategy;
exports.EthereumStrategy = EthereumStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EthereumStrategy);
//# sourceMappingURL=ethereum.strategy.js.map