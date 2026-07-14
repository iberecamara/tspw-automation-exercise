import { UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { SignupLoginPage } from '@pages/signup-login.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class SignupLoginSteps {

    readonly logger: TestAutomationLogger;
    readonly signupLoginPage: SignupLoginPage;

    constructor(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage) {
        this.logger = logger;
        this.signupLoginPage = signupLoginPage;
    }

    // Actions
    async enterLoginData(user: UserType): Promise<void> {
        this.logger.debug('Entering login data:');
        this.logger.debug(`Using email: ${user.email}`);
        this.logger.debug(`Using password: ${user.password}`);
        await test.step('Enter login data', async () => {
            await this.signupLoginPage.enterLoginEmail(user.email);
            await this.signupLoginPage.enterLoginPassword(user.password);
            await this.signupLoginPage.clickLogin();
        });
    };

    async enterSignupData(user: UserType): Promise<void> {
        this.logger.debug('Entering Signup data:');
        this.logger.debug(`Using login: ${user.name}`);
        this.logger.debug(`Using email: ${user.email}`);
        await test.step('Enter signup data', async () => {
            await this.signupLoginPage.enterSignupLogin(user.name);
            await this.signupLoginPage.enterSignupEmail(user.email);
        });
    }

    async clickSignup(): Promise<void> {
        this.logger.debug('Clicking Signup button.');
        await test.step('Click Signup', async () => {
            await this.signupLoginPage.clickSignup();
        });
        this.logger.debug('Signup button clicked.');
    }

    // Validations
    async validateLoginToAccountText(): Promise<void> {
        this.logger.debug('Validating Login section heading text.');
        await test.step('Validate that Signup / Login page have the expected text in the Login section', async () => {
            await expect.soft(
                this.signupLoginPage.locators.loginSectionHeader,
                `Login section header 'Login to your account' should be visible`
            ).toBeVisible();
        });
    };

    async validateNewUserSignupText(): Promise<void> {
        this.logger.debug('Validating Signup section heading text.');
        await test.step('Validate that Signup / Login page have the expected text in the Signup section', async () => {
            await expect.soft(
                this.signupLoginPage.locators.signupSectionHeader,
                `Signup section header 'New User Signup!' should be visible`
            ).toBeVisible();
        });
    }

    async validateInvalidCredentialsMessage(): Promise<void> {
        this.logger.debug('Validating Login section invalid credentials error message.');
        await test.step('Validate that Signup / Login page have the expected text for invalid credentials in the Login section', async () => {
            await expect.soft(
                this.signupLoginPage.locators.invalidCredentialsMessage,
                'Your email or password is incorrect!'
            ).toBeVisible();
        });
    }

    async validateEmailAlreadyExistsMessage(): Promise<void> {
        this.logger.debug('Validating Signup section email already exists error message.');
        await test.step('Validate that Signup / Login page have the expected text for exisint email in the Signup section', async () => {
            await expect.soft(
                this.signupLoginPage.locators.emailreadyExistsMessage,
                'Email Address already exist!'
            ).toBeVisible();
        });
    }

}