import { LoginApi } from '@api/login.api';
import { CustomResponseType } from '@data/types/custom-response.type';
import { test } from '@fixtures/fixtures';
import { TestAutomationLogger } from '@utils/logger.utils';
import { expect } from 'playwright/test';

export class LoginApiSteps {

    readonly logger: TestAutomationLogger;
    readonly loginApi: LoginApi;

    constructor(logger: TestAutomationLogger, loginApi: LoginApi) {
        this.logger = logger;
        this.loginApi = loginApi;
    }

    // Actions
    async verify(options?: { method?: 'POST' | 'DELETE', email?: string, password?: string }): Promise<CustomResponseType> {
        this.logger.debug('Retrieving raw response from API - Verify Login.');
        let response: CustomResponseType;
        await test.step('Retrieve raw response from API - Verify Login', async () => {
            response = await this.loginApi.verify(options) as CustomResponseType;
        });
        this.logger.debug('Retrieved raw response from API - Verify Login.');
        return response!;
    }

    // Validations
    async validateUserExists(response: CustomResponseType): Promise<void> {
        this.logger.debug('Validating User Exists - Verify Login.');
        await test.step('Validating User Exists - Verify Login', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for Verify Login where user exists should be 200'
            ).toBe(200);
            const expectedMessage = 'User exists!'
            expect.soft(
                response.body.message,
                `Message (from body) for Verify Login where user exists should be '${expectedMessage}'`
            ).toBe(expectedMessage);
        });
    }

    async validateUserNotFound(response: CustomResponseType): Promise<void> {
        this.logger.debug('Validating User Not Found - Verify Login.');
        await test.step('Validating User Not Found - Verify Login', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for Verify Login where user does not exist should be 404'
            ).toBe(404);
            const expectedMessage = 'User not found!'
            expect.soft(
                response.body.message,
                `Message (from body) for Verify Login where user does not exist should be '${expectedMessage}'`
            ).toBe(expectedMessage);
        });
    }

    async validateMissingParameter(response: CustomResponseType): Promise<void> {
        this.logger.debug('Validating Missing Parameter - Password - Verify Login.');
        await test.step('Validating Missing Parameter - Password - Verify Login', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for Missing Parameter - Password - Verify Login should be 400'
            ).toBe(400);
            const expectedMessage = 'Bad request, email or password parameter is missing in POST request.'
            expect.soft(
                response.body.message,
                `Message (from body) ffor Missing Parameter - Password - Verify Login should be '${expectedMessage}'`
            ).toBe(expectedMessage);
        });
    }

    async validateMethodNotAllowed(response: CustomResponseType): Promise<void> {
        this.logger.debug('Validating Method Not Allowed - DELETE - Verify Login.');
        await test.step('Validating Method Not Allowed - DELETE - Verify Login', async () => {
            expect.soft(
                response.body.responseCode,
                'Response Code (from body) for DELETE into Verify Login should be 405'
            ).toBe(405);
            const expectedMessage = 'This request method is not supported.'
            expect.soft(
                response.body.message,
                `Message (from body) for DELETE into Verify Login should be '${expectedMessage}'`
            ).toBe(expectedMessage);
        });
    }
}