import { Injectable } from '@nestjs/common';
import { TestApiClient } from '../clients/test-api/test-api.client';
import { CreateUserBody, User } from './users.model';
import { UsersUtils } from './users.utils';

@Injectable()
export class UsersService {
    constructor(private testApiClient: TestApiClient) {}

    public async getById(userId: number): Promise<User> {
        const user: User = await this.testApiClient.getUserById(userId);

        if (!user) throw new CustomError('user-not-found', 'Requested user does not exists', 404, { userId });

        return user;
    }

    public async createUser(body: CreateUserBody): Promise<User> {
        const fullName = UsersUtils.concatNameAndlastName(body.firstName, body.lastName);

        return this.testApiClient.createUser(fullName);
    }
}
