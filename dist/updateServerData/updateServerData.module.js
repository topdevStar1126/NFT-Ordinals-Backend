"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateServerDataModule = void 0;
const common_1 = require("@nestjs/common");
const updateServerData_controllers_1 = require("./updateServerData.controllers");
const updateServerData_service_1 = require("./updateServerData.service");
const database_module_1 = require("../database/database.module");
let UpdateServerDataModule = class UpdateServerDataModule {
};
exports.UpdateServerDataModule = UpdateServerDataModule;
exports.UpdateServerDataModule = UpdateServerDataModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [updateServerData_controllers_1.updateServerDataController],
        providers: [updateServerData_service_1.UpdateServerDataService],
    })
], UpdateServerDataModule);
//# sourceMappingURL=updateServerData.module.js.map