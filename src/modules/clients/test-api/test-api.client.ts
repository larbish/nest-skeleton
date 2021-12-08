import { Injectable } from '@nestjs/common';
import * as config from 'config';
import { User } from 'src/modules/users/users.model';
import { HttpClient } from '../../shared/http-client/http-client';

@Injectable()
export class TestApiClient {
    private readonly url: string;

    constructor(private httpClient: HttpClient) {
        this.url = config.get('apis.test.url');
    }

    public async getUserById(userId: number): Promise<User> {
        try {
            return await this.httpClient.get(`${this.url}/users/${userId}`, {}, {}, {});
        } catch (e) {
            throw new CustomError('user-not-found', 'Custom catch to override the one in httpClient', 404, { userId });
        }
    }

    public async createUser(fullName: string): Promise<User> {
        try {
            return await new Promise((resolve) => resolve({ fullName, id: 2 }));
        } catch (e) {
            throw new CustomError('user-creation-failed', 'Server can not create user', 500);
        }
    }
}
