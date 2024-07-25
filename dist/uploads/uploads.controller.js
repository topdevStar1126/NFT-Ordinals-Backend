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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const fs_1 = require("fs");
const path_1 = require("path");
const svg_parser_1 = require("svg-parser");
const jsdom_1 = require("jsdom");
const DOMPurify = require("dompurify");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../decorators");
const uploads_service_1 = require("./uploads.service");
const auth_guard_1 = require("../auth/auth.guard");
let UploadsController = class UploadsController {
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    async downloadSingle(encodedName, res) {
        const { fileInfo } = await this.uploadsService.getFileInfo(encodedName);
        const file = (0, fs_1.createReadStream)((0, path_1.join)(process.cwd(), `./uploads/${fileInfo.filename}`));
        res.set({
            'Content-Type': fileInfo.mimetype,
            'Content-Disposition': `${fileInfo.mimetype.indexOf('image') == 0 ||
                fileInfo.mimetype.indexOf('audio') == 0 ||
                fileInfo.mimetype.indexOf('video') == 0
                ? 'inline'
                : 'attachment'}; filename="${fileInfo.originalname}"`,
            'Content-Length': fileInfo.size,
            'X-Content-Type-Options': 'nosniff',
        });
        return Promise.resolve(new common_1.StreamableFile(file));
    }
    uploadSingle(request, file) {
        if (file.mimetype === 'image/svg+xml') {
            const fileContent = file.buffer.toString('utf8');
            try {
                (0, svg_parser_1.parse)(fileContent);
            }
            catch (error) {
                throw new Error('Invalid SVG file');
            }
            const window = new jsdom_1.JSDOM('').window;
            const purify = DOMPurify(window);
            const sanitizedSvg = purify.sanitize(fileContent, {
                USE_PROFILES: { svg: true },
            });
            file.buffer = Buffer.from(sanitizedSvg);
        }
        return this.uploadsService.uploadSingle(file);
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Get)(':encodedName'),
    __param(0, (0, common_1.Param)('encodedName')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "downloadSingle", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, decorators_1.ApiFile)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif' || file.mimetype === 'image/svg+xml') {
                cb(null, true);
            }
            else {
                cb(new Error('Invalid file type'), false);
            }
        },
    })),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadSingle", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads'),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map