# Nest Skeleton

## Description

[Nest](https://github.com/nestjs/nest) skeleton based on Typescript.

## Coding style

Typescript is used in a restrictive way thanks to ESLint. Commits are blocked if code does not match defined rules.

An `.editorconfig` file is provided in this repo in order to keep coding consitency between developers whatever the IDE. But it is highly recommended to use prettier and eslint pluggins as helpers.

### Linter

Eslint rules are editable in `.eslintrc`

### Prettier

Prettier `.prettierrc` is used to help developers formating their code

Apply pretttier config on intellij: https://prettier.io/docs/en/webstorm.html

Apply pretttier config on vscode: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

Custom vscode conf to apply prettier config and format on save:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Git hooks

Use commitlint `.commitlintrc.json` in order to force commit format: `<type>(<scope>): <short summary> <jira-card>` and use conventionnal commits proposed by angular (https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)

Use Husky `.huskyrc.json` to block git lifecycle (commit, linter...)

## Installation

```bash
$ npm install
```

## Running the app

### Local

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

```bash
# Build a dev image
$ docker-compose build

# Run a dev image with hotreloading
$ docker-compose up
```

In order to test this starter, you need to launch a nodejs server used as api endpoint. You can find it in /end-point-example-to-delete.

From the root folder, you can launch it with `node endpoint-example-to-delete/index-to-delete.js`.

It will be then replaced by api endpoint (such as graphql services like reservation-service) so the folder (name is quite explicit) can be deleted.

## Test

Tests are done using [jest](https://jestjs.io/docs/getting-started).

```bash
# unit tests
$ npm run test
```

This commande will launch unit tests defined in each modules with `*.spec.ts` extension.

Coverage must be as high as possible and will be display once the command succeed:

```bash
> NODE_CONFIG_DIR='src/config' jest

 PASS  src/modules/users/users.utils.spec.ts
  UsersUtils
    Concat first name and last name
      ✓ Success: return the concatenation (11 ms)

 PASS  src/modules/users/users.service.spec.ts
  UsersService
    Get user by id
      ✓ Error: throws an error when a user doesnt exist (13 ms)
      ✓ Success: return the found user (2 ms)
    Create
      ✓ Success: return the created user (2 ms)

 PASS  src/modules/users/users.controller.spec.ts
  UsersController
    Get user by id
      ✓ Success: return the found user (11 ms)
    Create user
      ✓ Success: return the created user (2 ms)

-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |    56.1 |     7.14 |      45 |   53.62 |
 clients/test-api      |   56.25 |      100 |      25 |   53.85 |
  test-api.client.ts   |   56.25 |      100 |      25 |   53.85 | 16-27
 shared/http-client    |   21.62 |        0 |   11.11 |   18.75 |
  http-client.ts |   21.62 |        0 |   11.11 |   18.75 | 24-129
 users                 |     100 |      100 |     100 |     100 |
  users.controller.ts  |     100 |      100 |     100 |     100 |
  users.service.ts     |     100 |      100 |     100 |     100 |
  users.utils.ts       |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|-------------------
Test Suites: 3 passed, 3 total
Tests:       6 passed, 6 total
Snapshots:   0 total
Time:        5.201 s, estimated 13 s
Ran all test suites.
```

## Release your application

```bash
# relase dry
$ npm run release:dry [major|minor|patch|version]

# release
$ npm run release [major|minor|patch|version]
```

A changelog based on angular preset is automatically updated by launching `npm run release [major|minor|patch|version]`.

To launch it manually, run the following command : `npm run build:changelog`

# Utilities

## Http Response

### Errors

This skeleton use a custom error named CustomError

A middleware has been created to handle `throw` and automatically return formatted response to the client.

For example, if the error is thrown with the following code :

```js
  public async getById(userId: number): Promise<User> {
        const user: User = await this.testApiClient.getUserById(userId);

        if (!user) throw new CustomError('user-not-found', 'Requested user does not exists', 404, { userId });

        return user;
    }
```

The sent response will be:

```json
{
    "code": "user-not-found",
    "status": 404,
    "message": "Requested user does not exists",
    "context": {
        "userId": "1"
    },
    "timestamp": "2021-05-28T10:07:35.108Z"
}
```

### Success

A controller juste have to send back his response object. A middleware will automatically encapsulated it in a `data` object. In order for the response to be:

```json
{
    "data": {
        "id": 1,
        "fullName": "Baptiste Leproux"
    }
}
```

## Http Client

A custom HttpClient named HttpClient and based on [axios](https://github.com/axios/axios) has been implemented in `/shared/http-client/http-client.ts`. All http methods are available using this http client.

Recommanded architecture is to create a client using HttpClient for each external api in `modules/clients`. For the starter, an example client (`/clients/test-api/test-api.client.ts`) as been created for the example node endpoint (/`endpoint-example-to-delete/index-to-delete.js`).

In this HttpClient, a global try catch has been implemented in order to avoid crash if a developer forget to try catch a part of the code.

For example, if the following http call return an error which is not catch:

```js
    public async getUserById(userId: number): Promise<User> {
        // try {
        return this.httpClient.get(`${this.url}/users/${userId}`, {}, {}, {});
        // } catch (e) {
        //     throw new CustomError('user-not-found', 'Custom catch to override the one in httpClient', 404, { userId });
        // }
    }
```

The app will catch the error and send back a generic error (generic error can be override in `/shared/http-client/http-client.ts`)

```json
{
    "code": "custom-http-error",
    "status": 500,
    "message": "An error occured during call to external api",
    "context": {
        "url": "http://localhost:3000/users/2",
        "method": "get",
        "responseTime": 19
    },
    "timestamp": "2021-05-28T10:14:11.197Z"
}
```

However, once a try catch is implemented, it overrides the generic error:

```js
    public async getUserById(userId: number): Promise<User> {
        try {
            return await this.httpClient.get(`${this.url}/users/${userId}`, {}, {}, {});
        } catch (e) {
            throw new CustomError('user-not-found', 'Custom catch to override the one in httpClient', 404, { userId });
        }
    }
```

Response:

```json
{
    "code": "user-not-found",
    "status": 404,
    "message": "Custom catch to override the one in httpClient",
    "context": {
        "userId": "2"
    },
    "timestamp": "2021-05-28T10:18:53.366Z"
}
```

## Validation

[class-validator](https://github.com/typestack/class-validator) is used for validation. It is based on decorator and handles payload validation.

Example:

```js
import { IsString } from 'class-validator';

export class CreateUserBody {
    @IsString()
    firstName!: string;

    @IsString()
    lastName!: string;
}
```

## OpenApi

OpenApi can be enable via the env variable `ENABLE_OPEN_API` set to `true`. If so, a swagger interface will be available on route url /api. Once the app is launch, you can see the swagger [here](localhost:8050/api). You can execute all public methods directly form the interface and see responses send back.

In order to set and build the swagger interface, swagger decorator from [nestjs/swagger](https://github.com/nestjs/swagger) must be used.

```js
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserBody {
    @ApiProperty({
        example: 'John',
        description: 'The name of the user',
    })
    @IsString()
    firstName!: string;

    @ApiProperty({
        example: 'Doe',
        description: 'The lastName of the user',
    })
    @IsString()
    lastName!: string;
}
```

```js
  @Post('')
    @ApiOperation({ summary: 'Create user' })
    @ApiCreatedResponse({ description: 'User created', type: User })
    @ApiBadRequestResponse({ description: 'Request body is not valid', type: ErrorResponse })
    @ApiForbiddenResponse({ description: 'Forbidden', type: ErrorResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized', type: ErrorResponse })
    async createUser(@Body() body: CreateUserBody): Promise<User> {
        return this.usersService.createUser(body);
    }
```

## Logs

Logs are based on logfmt format

In `DEBUG` mode (can be configured with `LOG_LEVEL` env var), all http requests are logged following this format: `{method} {originalUrl} {statusCode} - {contentLength}bytes {responseTime}ms`.

Example:

```
time=2021-05-28T10:18:53+00:00 level=debug msg="GET /users/2 404 - 161bytes 29ms"
```

## Config

Multi environment configuration is handled with [node-config](https://github.com/lorenwest/node-config).

All based config are in `default.json` and can be override by env with a `{node_env}.json` file.

ENV variables can be set in config using the `custom-environment-variables.json` file.

You can than get your config variable like that:

```js
import * as config from 'config';

config.get('enableOpenApi');
```
