import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

import * as winston from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  dotenv.config();
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      cors: {
        credentials: true,
      },
      logger: WinstonModule.createLogger({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.ms(),
              nestWinstonModuleUtilities.format.nestLike('woowow-backend', {
                colors: true,
                prettyPrint: true,
              }),
            ),
          }),
          new winston.transports.DailyRotateFile({
            filename: 'logs/woowow-backend-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
        ],
      }),
    });
    app.set('trust proxy', true);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    app.use(
      session({
        name: 'woowow-siwe',
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false, sameSite: true },
      }),
    );
    const options = new DocumentBuilder()
      .setTitle('Woowow back-end APIs')
      .setDescription('This is document for Woowow back-end APIs.')
      .setVersion('1.0')
      .addBearerAuth(
        {
          description: 'JWT Authorization',
          type: 'http',
          in: 'header',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'accessToken',
      )
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/api/docs', app, document, {
      customSiteTitle: 'Woowow API',
    });

    await app.listen(process.env.PORT || 5000);

    Logger.debug(`NODE ENVIRONMENT: ${process.env.NODE_ENV}`);

    Logger.debug(`The server is listening on: ${await app.getUrl()}`);
  } catch (error) {
    Logger.error('[main::bootstrap]', error);
  }
}
bootstrap();
