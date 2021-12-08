import { Test } from '@nestjs/testing';
import { TestApiClient } from '../clients/test-api/test-api.client';
import { HttpClient } from '../shared/http-client/http-client';
import { UsersController } from './users.controller';
import { CreateUserBody, User } from './users.model';
import { UsersService } from './users.service';

// Follow AAA pattern => assert(act(arrange()));
describe('UsersController', () => {
    let usersService: UsersService;
    let usersController: UsersController;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UsersService, TestApiClient, HttpClient],
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        usersController = moduleRef.get<UsersController>(UsersController);
    });

    describe('Get user by id', () => {
        it('Success: return the found user', async () => {
            // ARRANGE
            const userId = 1;
            const getUser: User = { id: userId, fullName: 'John Doe' };

            const usersServiceGetByIdSpy = jest.spyOn(usersService, 'getById').mockResolvedValue(getUser);

            // ACT
            const user = await usersController.getUserById({ id: userId });

            // ASSERT
            expect(usersServiceGetByIdSpy).toHaveBeenCalledWith(userId);
            expect(user).toBe(getUser);
        });
    });

    describe('Create user', () => {
        it('Success: return the created user', async () => {
            // ARRANGE
            const body: CreateUserBody = { firstName: 'John', lastName: 'Doe' };
            const createdUser: User = { id: 2, fullName: 'John Doe' };

            const usersServiceCreateUserSpy = jest.spyOn(usersService, 'createUser').mockResolvedValue(createdUser);

            // ACT
            const user = await usersController.createUser(body);

            // ASSERT
            expect(usersServiceCreateUserSpy).toHaveBeenCalledWith(body);
            expect(user).toBe(createdUser);
        });
    });
});
