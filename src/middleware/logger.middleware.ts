import { Request, Response, NextFunction } from 'express';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('close', () => {
        const contentLength = res.get('content-length');
        const responseTime = Date.now() - startTime;

        Log.Logger.debug(
            `${req.method} ${req.originalUrl} ${res.statusCode} - ${contentLength}bytes ${responseTime}ms`
        );
    });
    next();
};
