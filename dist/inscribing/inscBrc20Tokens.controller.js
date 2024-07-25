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
exports.InscBrc20TokensController = void 0;
const common_1 = require("@nestjs/common");
const inscBrc20Token_dto_1 = require("./inscBrc20Token.dto");
const inscBrc20Tokens_service_1 = require("./inscBrc20Tokens.service");
let InscBrc20TokensController = class InscBrc20TokensController {
    constructor(inscBrc20TokensService) {
        this.inscBrc20TokensService = inscBrc20TokensService;
    }
    async findAll() {
        return this.inscBrc20TokensService.findAll();
    }
    async getInscriptionData(tokenInscriptionId) {
        return this.inscBrc20TokensService.getInscriptionData(tokenInscriptionId);
    }
    create(brc20TokenDto) {
        this.inscBrc20TokensService.create(brc20TokenDto);
    }
    async getExistanceOfToken(token) {
        return this.inscBrc20TokensService.getExistanceOfToken(token);
    }
    async getMintrateOfToken(token) {
        return this.inscBrc20TokensService.getMintRateOfToken(token);
    }
    async getTest() {
        return this.inscBrc20TokensService.getTest();
    }
    async getTokenNames(keyWord) {
        return this.inscBrc20TokensService.getTokenNames(keyWord);
    }
};
exports.InscBrc20TokensController = InscBrc20TokensController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InscBrc20TokensController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('/getInscriptionData/:tokenInscriptionId'),
    __param(0, (0, common_1.Param)('tokenInscriptionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InscBrc20TokensController.prototype, "getInscriptionData", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [inscBrc20Token_dto_1.InscBrc20TokenDto]),
    __metadata("design:returntype", void 0)
], InscBrc20TokensController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('/tokenDeployed/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InscBrc20TokensController.prototype, "getExistanceOfToken", null);
__decorate([
    (0, common_1.Get)('/getMintRateOfToken/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InscBrc20TokensController.prototype, "getMintrateOfToken", null);
__decorate([
    (0, common_1.Get)('/test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InscBrc20TokensController.prototype, "getTest", null);
__decorate([
    (0, common_1.Get)('/getTokenNames/:keyWord'),
    __param(0, (0, common_1.Param)('keyWord')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InscBrc20TokensController.prototype, "getTokenNames", null);
exports.InscBrc20TokensController = InscBrc20TokensController = __decorate([
    (0, common_1.Controller)('inscBrc20'),
    __metadata("design:paramtypes", [inscBrc20Tokens_service_1.InscBrc20TokensService])
], InscBrc20TokensController);
//# sourceMappingURL=inscBrc20Tokens.controller.js.map