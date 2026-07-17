import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { CustomResponseType } from '@data/types/custom-response.type';
import { test } from '@fixtures/fixtures';

test.describe('User validations - API', {
    tag: ['@user', '@api']
}, async () => {

    test('POST To Create/Register User Account',
        { tag: ['@SAMPLE-0038', '@TC-API-11'] },
        async ({
            userApiSteps
        }) => {
            const user: UserType = GenerateRandomUser();
            const response: CustomResponseType = await userApiSteps.createAccount(user);
            await userApiSteps.validateCreateAccount(response);
            await userApiSteps.deleteAccount(user);
        });

    test('DELETE METHOD To Delete User Account',
        { tag: ['@SAMPLE-0039', '@TC-API-12'] },
        async ({
            userApiSteps
        }) => {
            const user: UserType = GenerateRandomUser();
            await userApiSteps.createAccount(user);
            const response: CustomResponseType = await userApiSteps.deleteAccount(user);
            await userApiSteps.validateDeleteAccount(response);
        });

    test('PUT METHOD To Update User Account',
        { tag: ['@SAMPLE-0040', '@TC-API-13'] },
        async ({
            userApiSteps
        }) => {
            const user: UserType = GenerateRandomUser();
            await userApiSteps.createAccount(user);
            const updatedUser: UserType = GenerateRandomUser({ name: user.name, email: user.email, password: user.password });
            const response: CustomResponseType = await userApiSteps.updateAccount(updatedUser);
            await userApiSteps.validateUpdateUser(response);
            await userApiSteps.deleteAccount(updatedUser);
        });

    test('GET user account detail by email',
        { tag: ['@SAMPLE-0041', '@TC-API-14'] },
        async ({
            userApiSteps
        }) => {
            const user: UserType = GenerateRandomUser();
            await userApiSteps.createAccount(user);
            const response: CustomResponseType = await userApiSteps.getUserByEmail(user.email);
            await userApiSteps.validateGetUser(response, user);
            await userApiSteps.deleteAccount(user);
        });

});
