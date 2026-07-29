import { BrandApi } from "@apis/brand.api";
import { LoginApi } from "@apis/login.api";
import { ProductApi } from "@apis/product.api";
import { UserApi } from "@apis/user.api";
import { APIRequestContext, test as base } from "@playwright/test";

/** Constructor signature every API client class satisfies: takes an `APIRequestContext`. */
type ApiConstructor<ApiClass> = new (request: APIRequestContext) => ApiClass;

/**
 * Builds a Playwright fixture function that instantiates the given API client class with the
 * test's `request` context, avoiding one near-identical fixture body per API client.
 *
 * @param apiConstructor - The API client class to instantiate (e.g. `UserApi`).
 * @returns A fixture function suitable for `test.extend()`.
 */
function createApiFixture<ApiClass>(apiConstructor: ApiConstructor<ApiClass>) {
  return async (
    { request }: { request: APIRequestContext },
    use: (value: ApiClass) => Promise<void>,
  ) => {
    const apiInstance = new apiConstructor(request);
    await use(apiInstance);
  };
}

/** One fixture per API client class. */
interface ApiFixtures {
  userApi: UserApi;
  productApi: ProductApi;
  brandApi: BrandApi;
  loginApi: LoginApi;
}

/** Extends the base Playwright `test` with one fixture per API client, ready to `mergeTests()` with the rest. */
export const test = base.extend<ApiFixtures>({
  userApi: createApiFixture(UserApi),
  productApi: createApiFixture(ProductApi),
  brandApi: createApiFixture(BrandApi),
  loginApi: createApiFixture(LoginApi),
});
