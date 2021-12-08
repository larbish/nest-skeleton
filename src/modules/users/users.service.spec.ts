/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { TestApiClient } from '../clients/test-api/test-api.client';
import { HttpClient } from '../shared/http-client/http-client';
import { CreateUserBody, User } from './users.model';
import { UsersService } from './users.service';
import { UsersUtils } from './users.utils';

jest.mock('./users.utils');

// Follow AAA pattern => assert(act(arrange()));
describe('UsersService', () => {
    let usersService: UsersService;
    let testApiClient: TestApiClient;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [UsersService, TestApiClient, HttpClient],
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        testApiClient = moduleRef.get<TestApiClient>(TestApiClient);
    });

    describe('Get user by id', () => {
        it('Error: throws an error when a user doesnt exist', async () => {
            // ARRANGE
            const userId = 1;
            const getUser: User = null;

            const testApiClietGetByIdSpy = jest.spyOn(testApiClient, 'getUserById').mockResolvedValue(getUser);

            try {
                // ACT
                await usersService.getById(userId);
            } catch (e) {
                // ASSERT
                expect(testApiClietGetByIdSpy).toHaveBeenCalledWith(userId);
                expect(e).toBeInstanceOf(CustomError);
                expect(e.code).toBe('user-not-found');
                expect(e.status).toBe(404);
            }
        });

        it('Success: return the found user', async () => {
            // ARRANGE
            const userId = 1;
            const getUser: User = { id: userId, fullName: 'John Doe' };

            const testApiClietGetByIdSpy = jest.spyOn(testApiClient, 'getUserById').mockResolvedValue(getUser);

            // ACT
            const user = await usersService.getById(userId);

            // ASSERT
            expect(testApiClietGetByIdSpy).toHaveBeenCalledWith(userId);
            expect(user).toBe(getUser);
        });
    });

    describe('Create', () => {
        it('Success: return the created user', async () => {
            // ARRANGE
            const body: CreateUserBody = { firstName: 'John', lastName: 'Doe' };
            const fullName = 'John Doe';
            const createdUser = { id: 2, fullName };

            // Mock for static methods
            const usersUtilsConcateMock = jest.fn().mockReturnValue(fullName);
            UsersUtils.concatNameAndlastName = usersUtilsConcateMock;
            // Mock for instancied method
            const testApiClietCreateUserSpy = jest.spyOn(testApiClient, 'createUser').mockResolvedValue(createdUser);

            // ACT
            const user = await usersService.createUser(body);

            // ASSERT
            expect(usersUtilsConcateMock).toHaveBeenCalledWith(body.firstName, body.lastName);
            expect(testApiClietCreateUserSpy).toHaveBeenCalledWith(fullName);
            expect(user).toBe(createdUser);
        });
    });
});
