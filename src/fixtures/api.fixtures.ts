
import { APIRequestContext, test as base } from '@playwright/test';
import { UserApi } from '@api/user.api';
import { ProductApi } from '@api/product.api';

type ApiConstructor<ApiClass> = new (request: APIRequestContext) => ApiClass;

function createApiFixture<ApiClass>(apiConstructor: ApiConstructor<ApiClass>) {
    return async ({ request }: { request: APIRequestContext }, use: (value: ApiClass) => Promise<void>) => {
        const apiInstance = new apiConstructor(request);
        await use(apiInstance);
    };
}

type ApiFixtures = {
    userApi: UserApi,
    productApi: ProductApi,
};

export const test = base.extend<ApiFixtures>({
    userApi: createApiFixture(UserApi),
    productApi: createApiFixture(ProductApi),
});
