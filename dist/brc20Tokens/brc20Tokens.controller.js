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
exports.Brc20TokensController = void 0;
const common_1 = require("@nestjs/common");
const brc20Tokens_service_1 = require("./brc20Tokens.service");
let Brc20TokensController = class Brc20TokensController {
    constructor(brc20TokensService) {
        this.brc20TokensService = brc20TokensService;
    }
    async searchTokens(searchTerm, page = 1, limit = 10) {
        return this.brc20TokensService.searchTokens(searchTerm, page, limit);
    }
    async test() {
        return this.brc20TokensService.test();
    }
    async getInscriptionData(tokenSlug) {
        return this.brc20TokensService.getInscriptionData(tokenSlug);
    }
};
exports.Brc20TokensController = Brc20TokensController;
__decorate([
    (0, common_1.Get)('searchTokens'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('limit', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], Brc20TokensController.prototype, "searchTokens", null);
__decorate([
    (0, common_1.Get)('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Brc20TokensController.prototype, "test", null);
__decorate([
    (0, common_1.Get)('/getInscriptionData/:tokenSlug'),
    __param(0, (0, common_1.Param)('tokenSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], Brc20TokensController.prototype, "getInscriptionData", null);
exports.Brc20TokensController = Brc20TokensController = __decorate([
    (0, common_1.Controller)('brc20-tokens'),
    __metadata("design:paramtypes", [brc20Tokens_service_1.Brc20TokensService])
], Brc20TokensController);
//# sourceMappingURL=brc20Tokens.controller.js.map