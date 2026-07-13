import { ProductApi } from '@api/product.api';
import { UserApi } from '@api/user.api';
import { EMPTY, NEWLINE } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { UserType } from '@data/model/user.model';
import { ResponseType } from '@data/types/response.type';
import { test } from '@fixtures/fixtures';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class ApiSteps {

    async createAccount(logger: TestAutomationLogger, userApi: UserApi, user: UserType): Promise<void> {
        logger.debug(`Creating user via API:${NEWLINE}${StringUtils.prettyJson(user)}`);
        await test.step('Create valid user via API', async () => {
            const response: ResponseType = await userApi.createUser(user);
            expect(response.responseCode, `User create response code must be 201`).toBe(201);
            expect(response.message, `User create response message must be 'User created!'`).toBe('User created!');
        });
        logger.debug('User created.');
    };

    async deleteAccount(logger: TestAutomationLogger, userApi: UserApi, user: UserType): Promise<void> {
        logger.debug(`Deleting user via API:${NEWLINE}${StringUtils.prettyJson(user)}`);
        await test.step('Delete user via API', async () => {
            const response: ResponseType = await userApi.deleteUser(user.email, user.password);
            expect(response.responseCode, 'User delete response code must be 200').toBe(200);
            expect(response.message, `User delete response must be 'Account deleted!'`).toBe('Account deleted!');
        });
        logger.debug('User deleted.');
    };

    async getAllProducts(logger: TestAutomationLogger, productApi: ProductApi): Promise<ProductType[]> {
        logger.debug('Retrieving all products from API.');
        const products: ProductType[] = [];
        await test.step('Retrieve all products from API.', async () => {
            products.push(...await productApi.all());
        });
        logger.debug(`Retrieved ${products.length} product${products.length > 1 ? 's' : EMPTY} from API.`);
        return products;
    }



}