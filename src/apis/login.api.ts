import { BaseApi } from "@apis/base.api";
import { Environment } from "@configs/environment.config";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { APIResponse } from "@playwright/test";
import { prettyJson } from "@utils/string.utils";

/** API client for `automationexercise.com/api`'s login-verification endpoint. */
export class LoginApi extends BaseApi {
  /**
   * Verifies a login via `{@link Environment.VERIFY_LOGIN_API_URL}`.
   *
   * @param options.method - HTTP method to use. Defaults to `"GET"`.
   * @param options.email - Email to verify.
   * @param options.password - Password to verify.
   * @remarks The request body is built from three independent checks (not else-if branches), so
   * only `email` set sends just `{ email }`, only `password` set sends just `{ password }`, both
   * set sends `{ email, password }`, and neither set sends an empty body — letting tests assert
   * on the API's distinct error responses for each incomplete combination.
   * @returns The raw HTTP status/text plus the parsed JSON response body.
   */
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
