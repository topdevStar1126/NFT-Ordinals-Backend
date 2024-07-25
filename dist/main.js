"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const dotenv = require("dotenv");
const session = require("express-session");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
require("winston-daily-rotate-file");
async function bootstrap() {
    dotenv.config();
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            cors: {
                credentials: true,
            },
            logger: nest_winston_1.WinstonModule.createLogger({
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nest_winston_1.utilities.format.nestLike('woowow-backend', {
                            colors: true,
                            prettyPrint: true,
                        })),
                    }),
                    new winston.transports.DailyRotateFile({
                        filename: 'logs/woowow-backend-%DATE%.log',
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: true,
                        maxSize: '20m',
                        maxFiles: '14d',
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    }),
                ],
            }),
        });
        app.set('trust proxy', true);
        app.useGlobalPipes(new common_1.ValidationPipe());
        app.setGlobalPrefix('api');
        app.use(session({
            name: 'woowow-siwe',
            secret: process.env.SESSION_SECRET,
            resave: true,
            saveUninitialized: true,
            cookie: { secure: false, sameSite: true },
        }));
        const options = new swagger_1.DocumentBuilder()
            .setTitle('Woowow back-end APIs')
            .setDescription('This is document for Woowow back-end APIs.')
            .setVersion('1.0')
            .addBearerAuth({
            description: 'JWT Authorization',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        }, 'accessToken')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, options);
        swagger_1.SwaggerModule.setup('/api/docs', app, document, {
            customSiteTitle: 'Woowow API',
        });
        await app.listen(process.env.PORT || 5000);
        common_1.Logger.debug(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`);
        common_1.Logger.debug(`The server is listening on: ${await app.getUrl()}`);
    }
    catch (error) {
        common_1.Logger.error('[main::bootstrap]', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map