import { expect, Page } from '@playwright/test';
import { test } from '@fixtures/fixtures';
import { TestAutomationLogger } from '@utils/logger.utils';
import { UserType } from '@data/model/user.model';
import { SignupLoginPage } from '@pages/signup-login.page';
import { Environment } from '@configs/environment.config';

export class SignupLoginSteps {

    async enterLoginData(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage, user: UserType): Promise<void> {
        logger.debug('Entering login data:');
        logger.debug(`Using email: ${user.email}`);
        logger.debug(`Using password: ${user.password}`);
        await test.step('Enter login data', async () => {
            await signupLoginPage.enterLoginEmail(user.email);
            await signupLoginPage.enterLoginPassword(user.password);
            await signupLoginPage.clickLogin();
        });
    };

    async enterSignupData(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage, user: UserType): Promise<void> {
        logger.debug('Entering Signup data:');
        logger.debug(`Using login: ${user.name}`);
        logger.debug(`Using email: ${user.email}`);
        await test.step('Enter signup data', async () => {
            await signupLoginPage.enterSignupLogin(user.name);
            await signupLoginPage.enterSignupEmail(user.email);
        });
    }

    async clickSignup(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage): Promise<void> {
        logger.debug('Clicking Signup button.');
        await test.step('Click Signup', async () => {
            await signupLoginPage.clickSignup();
        });
        logger.debug('Signup button clicked.');
    }

    async validateLoginToAccountText(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage): Promise<void> {
        logger.debug('Validating Login section heading text.');
        await test.step('Validate that Signup / Login page have the expected text in the Login section', async () => {
            await expect.soft(
                signupLoginPage.locators.loginSectionHeader,
                'Login section header "Login to your account" should be visible'
            ).toBeVisible();
        });
    };

    async validateNewUserSignupText(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage): Promise<void> {
        logger.debug('Validating Signup section heading text.');
        await test.step('Validate that Signup / Login page have the expected text in the Signup section', async () => {
            await expect.soft(
                signupLoginPage.locators.signupSectionHeader,
                'Signup section header "New User Signup!" should be visible'
            ).toBeVisible();
        });
    }

    async validateInvalidCredentialsMessage(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage): Promise<void> {
        logger.debug('Validating Login section invalid credentials error message.');
        await test.step('Validate that Signup / Login page have the expected text for invalid credentials in the Login section', async () => {
            await expect.soft(
                signupLoginPage.locators.invalidCredentialsMessage,
                'Your email or password is incorrect!'
            ).toBeVisible();
        });
    }

    async validateSignupLoginTitle(logger: TestAutomationLogger, page: Page): Promise<void> {
        logger.debug('Validating that application Signup / Login have the expected title.');
        await test.step('Validate that application Signup / Login have the expected title', async () => {
            await expect.soft(
                page,
                'Signup / Login page should have the expected title: "Automation Exercise - Signup / Login"'
            ).toHaveTitle('Automation Exercise - Signup / Login');
        });
    };

    async validateEmailAlreadyExistsMessage(logger: TestAutomationLogger, signupLoginPage: SignupLoginPage): Promise<void> {
        logger.debug('Validating Signup section email already exists error message.');
        await test.step('Validate that Signup / Login page have the expected text for exisint email in the Signup section', async () => {
            await expect.soft(
                signupLoginPage.locators.emailreadyExistsMessage,
                'Email Address already exist!'
            ).toBeVisible();
        });
    }

}