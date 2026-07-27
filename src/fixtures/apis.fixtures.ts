import { BrandApi } from "@apis/brand.api";
import { LoginApi } from "@apis/login.api";
import { ProductApi } from "@apis/product.api";
import { UserApi } from "@apis/user.api";
import { APIRequestContext, test as base } from "@playwright/test";

type ApiConstructor<ApiClass> = new (request: APIRequestContext) => ApiClass;

function createApiFixture<ApiClass>(apiConstructor: ApiConstructor<ApiClass>) {
  return async (
    { request }: { request: APIRequestContext },
    use: (value: ApiClass) => Promise<void>,
  ) => {
    const apiInstance = new apiConstructor(request);
    await use(apiInstance);
  };
}

interface ApiFixtures {
  userApi: UserApi;
  productApi: ProductApi;
  brandApi: BrandApi;
  loginApi: LoginApi;
}

export const test = base.extend<ApiFixtures>({
  userApi: createApiFixture(UserApi),
  productApi: createApiFixture(ProductApi),
  brandApi: createApiFixture(BrandApi),
  loginApi: createApiFixture(LoginApi),
});
