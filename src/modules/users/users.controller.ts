import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../middleware/exception.model';
import { CreateUserBody, GetUserByIdParams, User } from './users.model';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get(':id')
    @ApiOperation({ summary: 'Get user by id' })
    @ApiOkResponse({ description: 'User found', type: User })
    @ApiBadRequestResponse({ description: 'Request param is not valid', type: ErrorResponse })
    @ApiNotFoundResponse({ description: 'User not found', type: ErrorResponse })
    @ApiForbiddenResponse({ description: 'Forbidden', type: ErrorResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
    getUserById(@Param() params: GetUserByIdParams): Promise<User> {
        return this.usersService.getById(params.id);
    }

    @Post('')
    @ApiOperation({ summary: 'Create user' })
    @ApiCreatedResponse({ description: 'User created', type: User })
    @ApiBadRequestResponse({ description: 'Request body is not valid', type: ErrorResponse })
    @ApiForbiddenResponse({ description: 'Forbidden', type: ErrorResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
    async createUser(@Body() body: CreateUserBody): Promise<User> {
        return this.usersService.createUser(body);
    }
}
