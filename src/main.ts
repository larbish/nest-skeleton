import { INestApplication, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as pckg from '../package.json';
import { ExceptionHandlerInterceptor } from './middleware/exception-handler.interceptor';
import { loggerMiddleware } from './middleware/logger.middleware';

const logAppInfo = (port: string | number) => {
    Log.Logger.info(`============================================`);
    Log.Logger.info(`NAME              = ${pckg.name}`);
    Log.Logger.info(`VERSION           = ${pckg.version}`);
    Log.Logger.info(`PORT              = ${port}`);
    Log.Logger.info(`NODE_ENV          = ${config.get('env')}`);
    Log.Logger.info(`============================================`);
};

const initValidation = (app: INestApplication) => {
    app.useGlobalPipes(
        new ValidationPipe({
            enableDebugMessages: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const validationError = new CustomError('validation-errors', 'A validation error occurs', 400, {
                    errors,
                });
                Log.Logger.debug('validation-errors', validationError);
                throw validationError;
            },
        })
    );
};

const initSwagger = (app: INestApplication) => {
    const swaggerConfig = new DocumentBuilder()
        .setTitle(config.get('swagger.title'))
        .setDescription(config.get('swagger.description'))
        .setVersion(config.get('swagger.version'))
        .addTag('users')
        .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
};

const bootstrap = async () => {
    const port = Number(config.get('port'));

    // Create application object from nest factory - desactivate logger
    const app: INestApplication = await NestFactory.create(AppModule, { logger: config.get('env') === 'dev' });

    // Init global exception catcher in order to send back corresponding http response based on CustomError
    app.useGlobalFilters(new ExceptionHandlerInterceptor());

    // Init logger middleware to log all request on debug level
    app.use(loggerMiddleware);

    // Init validation using class-validator and class-transformer
    initValidation(app);

    // Init swagger
    if (config.get('enableOpenApi') === 'true') initSwagger(app);

    // Open listening port (PORT env variable) for application
    await app.listen(port, () => logAppInfo(port));
};

bootstrap().catch((error) => {
    Log.Logger.error(error);
});
