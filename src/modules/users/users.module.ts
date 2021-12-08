import { Module } from '@nestjs/common';
import { TestApiClient } from '../clients/test-api/test-api.client';
import { HttpClient } from '../shared/http-client/http-client';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UsersService, TestApiClient, HttpClient],
})
export class UsersModule {}
