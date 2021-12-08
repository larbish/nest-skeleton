import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseTransformInterceptor } from './middleware/response-handler.interceptor';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [UsersModule],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseTransformInterceptor,
        },
    ],
})
export class AppModule {}
