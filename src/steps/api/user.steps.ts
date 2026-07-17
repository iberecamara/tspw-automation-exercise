import { UserApi } from '@api/user.api';
import { UserType } from '@data/model/user.model';
import { CustomResponseType } from '@data/types/custom-response.type';
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

    // Actions
    async createAccount(user: UserType): Promise<CustomResponseType> {
        this.logger.debug(`Creating user via API:${StringUtils.prettyJson(user)}`);
        let response: CustomResponseType;
        await test.step('Create valid user via API', async () => {
            response = await this.userApi.createUser(user);
        });
        this.logger.debug('User created.');
        return response!;
    };

    async deleteAccount(user: UserType): Promise<CustomResponseType> {
        this.logger.debug(`Deleting user via API:${StringUtils.prettyJson(user)}`);
        let response: CustomResponseType;
        await test.step('Delete user via API', async () => {
            response = await this.userApi.deleteUser(user.email, user.password);
        });
        this.logger.debug('User deleted.');
        return response!;
    };

    async updateAccount(updatedUser: UserType): Promise<CustomResponseType> {
        this.logger.debug(`Updating user via API:${StringUtils.prettyJson(updatedUser)}`);
        let response: CustomResponseType;
        await test.step('Updating valid user via API', async () => {
            response = await this.userApi.updateUser(updatedUser);
        });
        this.logger.debug('User updated.');
        return response!;
    };

    async getUserByEmail(email: string,): Promise<CustomResponseType> {
        this.logger.debug('Retrieving Get User by Email.');
        let response: CustomResponseType;
        await test.step('Retrieve Get User by Email', async () => {
            response = await this.userApi.getUser(email)
        });
        this.logger.debug('Retrieved Get User by Email.');
        return response!;
    }

    // Validations
    async validateCreateAccount(response: CustomResponseType): Promise<void> {
        this.logger.debug('Validating Create User.');
        await test.step('Validate Create User', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for Create User should be 201'
            ).toBe(201);
            const expectedMessage = 'User created!'
            expect.soft(
                response.body.message,
                `Message (from body) for Create User should be '${expectedMessage}'`
            ).toBe(expectedMessage);
        });
    }

    async validateDeleteAccount(response: CustomResponseType): Promise<void> {
        this.logger.debug('Validating Delete User.');
        await test.step('Validating Delete User', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for Delete User should be 200'
            ).toBe(200);
            const expectedMessage = 'Account deleted!'
            expect.soft(
                response.body.message,
                `Message (from body) for Delete User should be '${expectedMessage}'`
            ).toBe(expectedMessage);
        });
    }

    async validateUpdateUser(response: CustomResponseType): Promise<void> {
        this.logger.debug('Validating Update User.');
        await test.step('Validate Update User', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for Update User should be 200'
            ).toBe(200);
            const expectedMessage = 'User updated!'
            expect.soft(
                response.body.message,
                `Message (from body) for Update User should be '${expectedMessage}'`
            ).toBe(expectedMessage);
        });
    }

    async validateGetUser(response: CustomResponseType, user: UserType): Promise<void> {
        this.logger.debug('Validating Get User by Email.');
        await test.step('Validating Get User by Email', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for Get User by Email should be 200'
            ).toBe(200);
            expect.soft(
                response.body,
                `Response body for Get User by Email should have a 'user' property`
            ).toHaveProperty('user');

            expect.soft(
                response.body.user?.name,
                `Response body 'user' for Get User by Email should match the user details - email`
            ).toStrictEqual(user.name);
            expect.soft(
                response.body.user?.email,
                `Response body 'user' for Get User by Email should match the user details - email`
            ).toStrictEqual(user.email);
            expect.soft(
                response.body.user?.address.title,
                `Response body 'user' for Get User by Email should match the user address details - title`
            ).toStrictEqual(user.address.title);


            expect.soft(
                response.body.user?.address.birthDate,
                `Response body 'user' for Get User by Email should match the user address details - birth day`
            ).toStrictEqual(user.address.birthDate);
            expect.soft(
                response.body.user?.address.birthMonth,
                `Response body 'user' for Get User by Email should match the user address details - birth month`
            ).toStrictEqual(user.address.birthMonth);
            expect.soft(
                response.body.user?.address.birthYear,
                `Response body 'user' for Get User by Email should match the user address details - birth year`
            ).toStrictEqual(user.address.birthYear);
            expect.soft(
                response.body.user?.address.firstname,
                `Response body 'user' for Get User by Email should match the user address details - first name`
            ).toStrictEqual(user.address.firstname);
            expect.soft(
                response.body.user?.address.lastname,
                `Response body 'user' for Get User by Email should match the user address details - last name`
            ).toStrictEqual(user.address.lastname);
            expect.soft(
                response.body.user?.address.company,
                `Response body 'user' for Get User by Email should match the user address details - company`
            ).toStrictEqual(user.address.company);
            expect.soft(
                response.body.user?.address.addressOne,
                `Response body 'user' for Get User by Email should match the user address details - address line one`
            ).toStrictEqual(user.address.addressOne);
            expect.soft(
                response.body.user?.address.addressTwo,
                `Response body 'user' for Get User by Email should match the user address details - address line two`
            ).toStrictEqual(user.address.addressTwo);
            expect.soft(
                response.body.user?.address.country,
                `Response body 'user' for Get User by Email should match the user address details - country`
            ).toStrictEqual(user.address.country);
            expect.soft(
                response.body.user?.address.state,
                `Response body 'user' for Get User by Email should match the user address details - state`
            ).toStrictEqual(user.address.state);
            expect.soft(
                response.body.user?.address.city,
                `Response body 'user' for Get User by Email should match the user address details - city`
            ).toStrictEqual(user.address.city);
            expect.soft(
                response.body.user?.address.zipcode,
                `Response body 'user' for Get User by Email should match the user address details - zipcode`
            ).toStrictEqual(user.address.zipcode);
        });
    }



}