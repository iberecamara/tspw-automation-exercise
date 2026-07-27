import { BaseApi } from "@apis/base.api";
import { Environment } from "@configs/environment.config";
import { EMPTY } from "@data/constants/string.constants";
import { UserType } from "@data/model/user.model";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { TestAutomationException } from "@exceptions/test-automation.exception";
import { APIResponse } from "@playwright/test";
import { prettyJson } from "@utils/string.utils";

export class UserApi extends BaseApi {
  async createUser(user: UserType): Promise<CustomResponseType> {
    this.validateUser(user);
    const formData = this.toUserFormData(user);
    const response: APIResponse = await this.request.post(
      Environment.CREATE_ACCOUNT_API_URL,
      { form: formData, failOnStatusCode: false },
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

  private toUserFormData(user: UserType): Record<string, string> {
    return {
      name: user.name,
      email: user.email,
      password: user.password ?? EMPTY,
      title: user.address.title,
      birth_date: user.address.birthDate,
      birth_month: user.address.birthMonth,
      birth_year: user.address.birthYear,
      firstname: user.address.firstname,
      lastname: user.address.lastname,
      company: user.address.company,
      address1: user.address.addressOne,
      address2: user.address.addressTwo,
      country: user.address.country,
      zipcode: user.address.zipcode,
      state: user.address.state,
      city: user.address.city,
      mobile_number: user.address.mobileNumber ?? EMPTY,
    };
  }

  private validateUser(user: UserType): void {
    if (!user.password) {
      throw new TestAutomationException(
        `User password cannot be undefined/null but was '${user.password}'.`,
      );
    }
    if (!user.address.mobileNumber) {
      throw new TestAutomationException(
        `User mobile number cannot be undefined/null but was '${user.address.mobileNumber}'.`,
      );
    }
  }

  async deleteUser(
    email: string,
    password: string,
  ): Promise<CustomResponseType> {
    const formData = {
      email: email,
      password: password,
    };
    const response: APIResponse = await this.request.delete(
      Environment.DELETE_ACCOUNT_API_URL,
      { form: formData },
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

  async updateUser(updatedUser: UserType): Promise<CustomResponseType> {
    this.validateUser(updatedUser);
    const formData = this.toUserFormData(updatedUser);
    const response: APIResponse = await this.request.put(
      Environment.UPDATE_ACCOUNT_API_URL,
      { form: formData, failOnStatusCode: false },
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

  async getUser(email: string): Promise<CustomResponseType> {
    const params = { email: email };
    const response: APIResponse = await this.request.get(
      Environment.GET_USER_BY_EMAIL_API_URL,
      { params: params },
    );
    const body = (await response.json()) as CustomResponseBodyType;
    this.logger.debug(
      `Response [${response.status()} ${response.url()}]: ${
        body ? prettyJson(body) : "<no JSON body>"
      }`,
    );
    body.user = {
      id: body.user?.id ?? 0,
      name: body.user?.name ?? EMPTY,
      email: body.user?.email ?? EMPTY,
      title: body.user?.title ?? "Mr.",
      birth_day: body.user?.birth_day ?? EMPTY,
      birth_month: body.user?.birth_month ?? EMPTY,
      birth_year: body.user?.birth_year ?? EMPTY,
      first_name: body.user?.first_name ?? EMPTY,
      last_name: body.user?.last_name ?? EMPTY,
      company: body.user?.company ?? EMPTY,
      address1: body.user?.address1 ?? EMPTY,
      address2: body.user?.address2 ?? EMPTY,
      country: body.user?.country ?? EMPTY,
      state: body.user?.state ?? EMPTY,
      city: body.user?.city ?? EMPTY,
      zipcode: body.user?.zipcode ?? EMPTY,
    };
    return {
      statusCode: response.status(),
      statusText: response.statusText(),
      body: body,
    };
  }
}
