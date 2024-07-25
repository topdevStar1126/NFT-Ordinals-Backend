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
exports.OperatorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
const bcrypt = require("bcrypt");
const result_1 = require("../utils/result");
let OperatorService = class OperatorService {
    constructor(operatorModel) {
        this.operatorModel = operatorModel;
        this.initializeAdminOperator();
    }
    async initializeAdminOperator() {
        const { INITIAL_OPERATOR_USERNAME: username = 'admin', INITIAL_OPERATOR_PASSWORD: password = 'admin123', INITIAL_OPERATOR_EMAIL: email = 'admin@example.com' } = process.env;
        if (!username || !password || !email)
            return;
        const existingUser = await this.operatorModel.findOne({ username });
        const existingEmailUser = await this.operatorModel.findOne({ email });
        if (existingEmailUser && (!existingUser || existingEmailUser.username !== username)) {
            console.error(`Email ${email} is already in use.`);
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const currentDate = new Date();
        const operatorData = {
            username,
            password: hashedPassword,
            email,
            createdAt: currentDate
        };
        if (existingUser) {
            Object.assign(existingUser, operatorData);
            await existingUser.save();
        }
        else {
            const newOperator = new this.operatorModel(operatorData);
            await newOperator.save();
        }
    }
    async findPaginated(filter, page, limit) {
        const offset = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.operatorModel.find(filter).skip(offset).limit(limit).exec(),
            this.operatorModel.countDocuments(filter).exec(),
        ]);
        return { data, total };
    }
    async createOperator(operatorDto) {
        const operator = await this.operatorModel.create({
            username: operatorDto.username,
            password: operatorDto.password,
            nickname: operatorDto.nickname,
            email: operatorDto.email,
            createdAt: new Date(),
        });
        return operator;
    }
    async findOneOperatorName(username) {
        const operator = await this.operatorModel.findOne({
            username: username,
        }).exec();
        if (!operator)
            throw new common_1.HttpException(result_1.ResultData.fail(500, '用户不存在!'), common_1.HttpStatus.OK);
        return {
            id: operator.id,
            username: operator.username,
            email: operator.email,
            password: operator.password,
        };
    }
    async findById(id) {
        return await this.operatorModel.findOne({ _id: id }).exec();
    }
    async updateOperator(operatorDto) {
        const operator = await this.findById(operatorDto._id);
        if (!operator) {
            throw new common_1.HttpException(result_1.ResultData.fail(500, '用户不存在!'), common_1.HttpStatus.OK);
        }
        operator.nickname = operatorDto.nickname;
        operator.email = operatorDto.email;
        return await this.operatorModel.findByIdAndUpdate(operatorDto._id, operator);
    }
    async updatePwd(operatorDto) {
        const operator = await this.findById(operatorDto._id);
        if (!operator) {
            throw new common_1.HttpException(result_1.ResultData.fail(500, '用户不存在!'), common_1.HttpStatus.OK);
        }
        if (await bcrypt.compare(operatorDto.old_password, operator.password)) {
            operator.password = await bcrypt.hash(operatorDto.new_password, 10);
            return await this.operatorModel.findByIdAndUpdate(operatorDto._id, operator);
        }
        else {
            throw new common_1.HttpException(result_1.ResultData.fail(500, '原密码错误!'), common_1.HttpStatus.OK);
        }
    }
};
exports.OperatorService = OperatorService;
exports.OperatorService = OperatorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.OperatorSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], OperatorService);
//# sourceMappingURL=operator.service.js.map