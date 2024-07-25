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
exports.UserSchema = exports.UserSchemaModel = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let UserSchemaModel = class UserSchemaModel {
};
exports.UserSchemaModel = UserSchemaModel;
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "nickname", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "wallet", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "discord", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, trim: true, index: true, unique: true, sparse: true }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "telegram", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], UserSchemaModel.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], UserSchemaModel.prototype, "createdAt", void 0);
exports.UserSchemaModel = UserSchemaModel = __decorate([
    (0, mongoose_1.Schema)({
        versionKey: false,
    })
], UserSchemaModel);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(UserSchemaModel);
//# sourceMappingURL=user.schema.js.map