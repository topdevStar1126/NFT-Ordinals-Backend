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
exports.OperatorController = void 0;
const common_1 = require("@nestjs/common");
const operator_dto_1 = require("./operator.dto");
const operator_service_1 = require("./operator.service");
const auth_guard_1 = require("../auth/auth.guard");
let OperatorController = class OperatorController {
    constructor(operatorService) {
        this.operatorService = operatorService;
    }
    async createOperator(operatorDto) {
        return this.operatorService.createOperator(operatorDto);
    }
    async updateOperator(operatorDto) {
        return this.operatorService.updateOperator(operatorDto);
    }
    async updatePwd(operatorDto) {
        return this.operatorService.updatePwd(operatorDto);
    }
    async list(page = 1, limit = 10, username, email) {
        const filter = {};
        if (username) {
            filter.username = new RegExp(username, 'i');
        }
        if (email) {
            filter.email = new RegExp(email, 'i');
        }
        return this.operatorService.findPaginated(filter, page, limit);
    }
    async getInfo(req) {
        const operator = await this.operatorService.findById(req.user.sub);
        return {
            id: operator.id,
            username: operator.username,
            nickname: operator.nickname,
            email: operator.email,
            createdAt: operator.createdAt,
        };
    }
};
exports.OperatorController = OperatorController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [operator_dto_1.OperatorDto]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "createOperator", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [operator_dto_1.OperatorDto]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "updateOperator", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('pwd'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [operator_dto_1.OperatorDto]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "updatePwd", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('list'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('username')),
    __param(3, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "list", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getInfo'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OperatorController.prototype, "getInfo", null);
exports.OperatorController = OperatorController = __decorate([
    (0, common_1.Controller)('operator'),
    __metadata("design:paramtypes", [operator_service_1.OperatorService])
], OperatorController);
//# sourceMappingURL=operator.controller.js.map