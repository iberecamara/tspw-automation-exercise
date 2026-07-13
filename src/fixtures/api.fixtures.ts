
import { APIRequestContext, test as base } from "@playwright/test";
import { UserApi } from "@api/user.api";
import { ProductApi } from "@api/product.api";

type ApiConstructor<T> = new (request: APIRequestContext) => T;

function createApiFixture<T>(apiConstructor: ApiConstructor<T>) {
    return async ({ request }: { request: APIRequestContext }, use: (value: T) => Promise<void>) => {
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
