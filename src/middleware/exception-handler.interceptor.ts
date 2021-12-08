/* eslint-disable @typescript-eslint/lines-between-class-members */
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ErrorResponse } from './exception.model';

@Catch()
export class ExceptionHandlerInterceptor implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        // Default error
        let errorContext = {};
        let status = 500;
        let code = 'internal-server-error';
        let message = 'Unknown error occured';

        // CustomError catch
        if (exception instanceof CustomError) {
            code = exception.code;
            if (exception.status) status = exception.status;
            if (exception.message) message = exception.message;
            if (exception.context) errorContext = exception.context;
        }

        const errorResponse: ErrorResponse = {
            code,
            status,
            message,
            context: errorContext,
            timestamp: new Date().toISOString(),
        };

        response.status(status).json(errorResponse);
    }
}
