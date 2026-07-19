import { BaseApi } from "@api/base.api";
import { Environment } from "@configs/environment.config";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { APIRequestContext, APIResponse } from "@playwright/test";
import { StringUtils } from "@utils/string.utils";

export class LoginApi extends BaseApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    super();
    this.request = request;
  }

  async verify(options?: {
    method?: "POST" | "DELETE";
    email?: string;
    password?: string;
  }): Promise<CustomResponseType> {
    let formData = {};
    if (options?.email) {
      formData = { email: options.email };
    }
    if (options?.password) {
      formData = { password: options.password };
    }
    if (options?.email && options?.password) {
      formData = { email: options.email, password: options.password };
    }
    const method = options?.method ?? "GET";
    const response: APIResponse = await this.request.fetch(
      Environment.VERIFY_LOGIN_API_URL,
      { method: method, form: formData },
    );
    this.logger.debug(`Response: ${StringUtils.prettyJson(response)}`);
    const body = (await response.json()) as CustomResponseBodyType;
    return {
      statusCode: response.status(),
      statusText: response.statusText(),
      body: body,
    };
  }
}
