import { DELETED } from '@data/constants/common.constants';
import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';

test.describe('User login validations - UI', {
    tag: ['@user-login', '@ui']
}, () => {

    let user: UserType;

    test.beforeEach('Create valid user via API', async ({ userApiSteps }) => {
        user = GenerateRandomUser();
        await userApiSteps.createAccount(user);
    });

    test('Login User with correct email and password',
        { tag: ['@SAMPLE-0001', '@TC-UI-2', '@valid-user'] },
        async ({
            signupLoginSteps, accountCreatedDeletedSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            await signupLoginSteps.login(user);
            await sharedSteps.validateUserLoggedText(homePage.header, user);
            await sharedSteps.clickDeleteAccount(homePage.header);
            await accountCreatedDeletedSteps.validateAccountActionText(DELETED);
        });

    test('Login User with incorrect email',
        { tag: ['@SAMPLE-0002', '@TC-UI-3', '@TC-UI-3.1', '@login-error', '@invalid-user'] },
        async ({
            signupLoginSteps, userApiSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            const email = user.email;
            user.email = `invalid_${user.email}`;
            await signupLoginSteps.login(user);
            await signupLoginSteps.validateInvalidCredentialsMessage();
            user.email = email;
            await userApiSteps.deleteAccount(user);
        });

    test('Login User with incorrect password',
        { tag: ['@SAMPLE-0003', '@TC-UI-3', '@TC-UI-3.2', '@invalid-password'] },
        async ({
            signupLoginSteps, userApiSteps, homePage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickSignupLogin(homePage.header);
            await signupLoginSteps.validateLoginToAccountText();
            const password = user.password;
            user.password = `invalid_${user.password}`;
            await signupLoginSteps.login(user);
            await signupLoginSteps.validateInvalidCredentialsMessage();
            user.password = password;
            await userApiSteps.deleteAccount(user);
        });

});
