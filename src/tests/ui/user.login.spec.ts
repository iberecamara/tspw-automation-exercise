import { test } from '@fixtures/fixtures';
import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { DELETED } from '@data/constants/common.constants';

test.describe('User login', async () => {

    let user: UserType;
    test.beforeEach('Create valid user via API', async ({ logger, userApi, apiSteps }) => {
        user = GenerateRandomUser();
        await apiSteps.createAccount(logger, userApi, user);
    });

    test('Login User with correct email and password',
        { tag: ['@SAMPLE-0001', '@TC2', '@user-login', '@valid-user'] },
        async ({
            logger, page, homeSteps, signupLoginSteps, accountCreatedDeletedSteps,
            homePage, signupLoginPage, accountCreatedDeletedPage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await sharedSteps.validateTitle(logger, page, 'Home');
            await sharedSteps.clickSignupLogin(logger, homePage.header);
            await signupLoginSteps.validateLoginToAccountText(logger, signupLoginPage);
            await signupLoginSteps.enterLoginData(logger, signupLoginPage, user);
            await sharedSteps.validateUserLoggedText(logger, homePage.header, user);
            await sharedSteps.clickDeleteAccount(logger, homePage.header);
            await accountCreatedDeletedSteps.validateAccountActionText(logger, accountCreatedDeletedPage, DELETED);
        });

    test('Login User with incorrect email',
        { tag: ['@SAMPLE-0002', '@TC3', '@TC3.1', '@user-login', '@login-error', '@invalid-user'] },
        async ({
            logger, page, homeSteps, signupLoginSteps, apiSteps, userApi, homePage, signupLoginPage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await sharedSteps.validateTitle(logger, page, 'Home');
            await sharedSteps.clickSignupLogin(logger, homePage.header);
            await signupLoginSteps.validateLoginToAccountText(logger, signupLoginPage);
            const email = user.email;
            user.email = `invalid_${user.email}`;
            await signupLoginSteps.enterLoginData(logger, signupLoginPage, user);
            await signupLoginSteps.validateInvalidCredentialsMessage(logger, signupLoginPage);
            user.email = email;
            await apiSteps.deleteAccount(logger, userApi, user);
        });

    test('Login User with incorrect password',
        { tag: ['@SAMPLE-0003', '@TC3', '@TC3.2', '@user-login', '@invalid-password'] },
        async ({
            logger, page, homeSteps, signupLoginSteps, userApi, apiSteps, homePage, signupLoginPage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await sharedSteps.validateTitle(logger, page, 'Home');
            await sharedSteps.clickSignupLogin(logger, homePage.header);
            await signupLoginSteps.validateLoginToAccountText(logger, signupLoginPage);
            const password = user.password;
            user.password = `invalid_${user.password}`;
            await signupLoginSteps.enterLoginData(logger, signupLoginPage, user);
            await signupLoginSteps.validateInvalidCredentialsMessage(logger, signupLoginPage);
            user.password = password;
            await apiSteps.deleteAccount(logger, userApi, user);
        });

});
