import { UserApi } from '@api/user.api';
import { UserType } from '@data/model/user.model';
import { ResponseType } from '@data/types/response.type';
import { test } from '@fixtures/fixtures';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class UserApiSteps {

    readonly logger: TestAutomationLogger;
    readonly userApi: UserApi;

    constructor(logger: TestAutomationLogger, userApi: UserApi) {
        this.logger = logger;
        this.userApi = userApi;
    }

    async createAccount(user: UserType): Promise<void> {
        this.logger.debug(`Creating user via API:${StringUtils.prettyJson(user)}`);
        await test.step('Create valid user via API', async () => {
            const response: ResponseType = await this.userApi.createUser(user);
            expect(response.responseCode, `User create response code must be 201`).toBe(201);
            expect(response.message, `User create response message must be 'User created!'`).toBe('User created!');
        });
        this.logger.debug('User created.');
    };

    async deleteAccount(user: UserType): Promise<void> {
        this.logger.debug(`Deleting user via API:${StringUtils.prettyJson(user)}`);
        await test.step('Delete user via API', async () => {
            const response: ResponseType = await this.userApi.deleteUser(user.email, user.password);
            expect(response.responseCode, 'User delete response code must be 200').toBe(200);
            expect(response.message, `User delete response must be 'Account deleted!'`).toBe('Account deleted!');
        });
        this.logger.debug('User deleted.');
    };

}