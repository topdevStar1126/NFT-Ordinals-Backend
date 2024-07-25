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
exports.ResultData = exports.SUCCESS_CODE = void 0;
const swagger_1 = require("@nestjs/swagger");
exports.SUCCESS_CODE = 200;
class ResultData {
    constructor(code = exports.SUCCESS_CODE, msg, data) {
        this.code = code;
        this.msg = msg || 'ok';
        this.data = data || null;
    }
    static ok(data, msg) {
        return new ResultData(exports.SUCCESS_CODE, msg, data);
    }
    static fail(code, msg, data) {
        return new ResultData(code || 500, msg || 'fail', data);
    }
}
exports.ResultData = ResultData;
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'number', default: exports.SUCCESS_CODE }),
    __metadata("design:type", Number)
], ResultData.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: 'string', default: 'ok' }),
    __metadata("design:type", String)
], ResultData.prototype, "msg", void 0);
//# sourceMappingURL=result.js.map