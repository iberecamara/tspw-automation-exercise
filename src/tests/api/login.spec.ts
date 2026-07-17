import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { CustomResponseType } from '@data/types/custom-response.type';
import { test } from '@fixtures/fixtures';

test.describe('Login validations - API', {
    tag: ['@login', '@api']
}, async () => {

    test('POST To Verify Login with valid details',
        { tag: ['@SAMPLE-0034', '@TC-API-7'] },
        async ({
            loginApiSteps, userApiSteps
        }) => {
            const user: UserType = GenerateRandomUser();
            await userApiSteps.createAccount(user);
            const response: CustomResponseType = await loginApiSteps.verify({ method: 'POST', email: user.email, password: user.password }) as CustomResponseType;
            await loginApiSteps.validateUserExists(response);
            await userApiSteps.deleteAccount(user);
        });

    test('POST To Verify Login without email parameter',
        { tag: ['@SAMPLE-0035', '@TC-API-8'] },
        async ({
            loginApiSteps, userApiSteps
        }) => {
            const user: UserType = GenerateRandomUser();
            await userApiSteps.createAccount(user);
            const response: CustomResponseType = await loginApiSteps.verify({ method: 'POST', password: user.password }) as CustomResponseType;
            await loginApiSteps.validateMissingParameter(response);
            await userApiSteps.deleteAccount(user);
        });

    test('DELETE To Verify Login',
        { tag: ['@SAMPLE-0036', '@TC-API-9'] },
        async ({
            loginApiSteps
        }) => {
            const response: CustomResponseType = await loginApiSteps.verify({ method: 'DELETE' }) as CustomResponseType;
            await loginApiSteps.validateMethodNotAllowed(response);
        });

    test('POST To Verify Login with invalid details',
        { tag: ['@SAMPLE-0037', '@TC-API-10'] },
        async ({
            loginApiSteps
        }) => {
            const email = 'notavalidemailforsure@shouldnotwork.com';
            const password = 'definatelynotavalidpassword';
            const response: CustomResponseType = await loginApiSteps.verify({ method: 'POST', email: email, password: password }) as CustomResponseType;
            await loginApiSteps.validateUserNotFound(response);
        });

});
