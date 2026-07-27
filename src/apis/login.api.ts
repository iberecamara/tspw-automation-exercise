import { BaseApi } from "@apis/base.api";
import { Environment } from "@configs/environment.config";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { APIResponse } from "@playwright/test";
import { prettyJson } from "@utils/string.utils";

export class LoginApi extends BaseApi {
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
    const body = (await response.json()) as CustomResponseBodyType;
    this.logger.debug(
      `Response [${response.status()} ${response.url()}]: ${
        body ? prettyJson(body) : "<no JSON body>"
      }`,
    );
    return {
      statusCode: response.status(),
      statusText: response.statusText(),
      body: body,
    };
  }
}
