"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const collections_module_1 = require("./collections/collections.module");
const uploads_module_1 = require("./uploads/uploads.module");
const tokens_module_1 = require("./tokens/tokens.module");
const accounts_module_1 = require("./accounts/accounts.module");
const transfers_module_1 = require("./transfers/transfers.module");
const brc20Tokens_module_1 = require("./brc20Tokens/brc20Tokens.module");
const inscBrc20Tokens_module_1 = require("./inscribing/inscBrc20Tokens.module");
const updateServerData_module_1 = require("./updateServerData/updateServerData.module");
const createListings_module_1 = require("./createListings/createListings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                expandVariables: true,
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            collections_module_1.CollectionsModule,
            uploads_module_1.UploadsModule,
            tokens_module_1.TokensModule,
            accounts_module_1.AccountsModule,
            transfers_module_1.TransfersModule,
            brc20Tokens_module_1.Brc20TokensModule,
            inscBrc20Tokens_module_1.InscBrc20TokensModule,
            updateServerData_module_1.UpdateServerDataModule,
            createListings_module_1.createListingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map