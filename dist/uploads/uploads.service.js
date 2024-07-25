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
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const client_s3_1 = require("@aws-sdk/client-s3");
const lib_storage_1 = require("@aws-sdk/lib-storage");
const uuid_1 = require("uuid");
const mongoose_2 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
let UploadsService = class UploadsService {
    constructor(uploadModel) {
        this.uploadModel = uploadModel;
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_S3_REGION,
            credentials: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_KEY,
            },
        });
    }
    async getFileInfo(encodedname) {
        const documents = await this.uploadModel.find({ filename: encodedname });
        if (documents.length == 0) {
            throw new common_1.HttpException(`Wrong file id provided.`, common_1.HttpStatus.BAD_REQUEST);
        }
        return { fileInfo: documents[0] };
    }
    async uploadSingle(file) {
        const fileKey = (0, uuid_1.v4)();
        const uploadS3 = new lib_storage_1.Upload({
            client: this.s3Client,
            params: {
                Bucket: process.env.AWS_S3_BUCKET,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            },
        });
        await uploadS3.done();
        const newUpload = file;
        newUpload.createdAt = new Date();
        newUpload.path = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileKey}`;
        const upload = new this.uploadModel(newUpload);
        await upload.save();
        return {
            path: upload.path,
        };
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(schemas_1.UploadSchemaModel.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map