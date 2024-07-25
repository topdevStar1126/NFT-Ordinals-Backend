"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
const dotenv = require("dotenv");
dotenv.config();
console.log(process.env.DB_URL);
const modules = [
    mongoose_1.MongooseModule.forRoot(process.env.DB_URL),
    mongoose_1.MongooseModule.forFeatureAsync([
        {
            name: schemas_1.UserSchemaModel.name,
            useFactory: () => {
                const schema = schemas_1.UserSchema;
                return schema;
            },
            collection: 'users',
        },
        {
            name: schemas_1.CollectionSchemaModel.name,
            useFactory: () => {
                const schema = schemas_1.CollectionSchema;
                return schema;
            },
            collection: 'collections',
        },
        {
            name: schemas_1.UploadSchemaModel.name,
            useFactory: () => {
                const schema = schemas_1.UploadSchema;
                return schema;
            },
            collection: 'uploads',
        },
        {
            name: schemas_1.TokenSchemaModel.name,
            useFactory: () => {
                const schema = schemas_1.TokenSchema;
                return schema;
            },
            collection: 'tokens',
        },
        {
            name: schemas_1.AccountSchemaModel.name,
            useFactory: () => {
                const schema = schemas_1.AccountSchema;
                return schema;
            },
            collection: 'accounts',
        },
        {
            name: schemas_1.TransferSchemaModel.name,
            useFactory: () => {
                const schema = schemas_1.TokenTickerSchema;
                return schema;
            },
            collection: 'transfers',
        },
        {
            name: schemas_1.TokenTickerSchemaModel.name,
            useFactory: () => {
                const schema = schemas_1.TokenTickerSchema;
                return schema;
            },
            collection: 'tokenTickers',
        },
    ]),
];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [...modules],
        exports: [...modules],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map