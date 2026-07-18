import { Environment } from '@configs/environment.config';
import { EMPTY } from '@data/constants/string.constants';
import { UserType } from '@data/model/user.model';
import { CustomResponseBodyType, CustomResponseType } from '@data/types/custom-response.type';
import { TestAutomationException } from '@exceptions/test-automation.exception';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class UserApi {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createUser(user: UserType): Promise<CustomResponseType> {
        if (!user.password) {
            throw new TestAutomationException(`User password cannot be undefined/null but was '${user.password}'.`);
        }
        if (!user.address.mobileNumber) {
            throw new TestAutomationException(`User moobile number cannot be undefined/null but was '${user.address.mobileNumber}'.`);
        }
        const formData = {
            name: user.name,
            email: user.email,
            password: user.password,
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
            mobile_number: user.address.mobileNumber
        };
        const response: APIResponse = await this.request.post(Environment.CREATE_ACCOUNT_API_URL, { form: formData, failOnStatusCode: false });
        const body = await response.json() as CustomResponseBodyType;
        return {
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body
        };
    }

    async deleteUser(email: string, password: string): Promise<CustomResponseType> {
        const formData = {
            email: email,
            password: password
        }
        const response: APIResponse = await this.request.delete(Environment.DELETE_ACCOUNT_API_URL, { form: formData });
        const body = await response.json() as CustomResponseBodyType;
        return {
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body
        };
    }

    async updateUser(updatedUser: UserType): Promise<CustomResponseType> {
        if (!updatedUser.password) {
            throw new TestAutomationException(`User password cannot be undefined/null but was '${updatedUser.password}'.`);
        }
        if (!updatedUser.address.mobileNumber) {
            throw new TestAutomationException(`User moobile number cannot be undefined/null but was '${updatedUser.address.mobileNumber}'.`);
        }
        const formData = {
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
            title: updatedUser.address.title,
            birth_date: updatedUser.address.birthDate,
            birth_month: updatedUser.address.birthMonth,
            birth_year: updatedUser.address.birthYear,
            firstname: updatedUser.address.firstname,
            lastname: updatedUser.address.lastname,
            company: updatedUser.address.company,
            address1: updatedUser.address.addressOne,
            address2: updatedUser.address.addressTwo,
            country: updatedUser.address.country,
            zipcode: updatedUser.address.zipcode,
            state: updatedUser.address.state,
            city: updatedUser.address.city,
            mobile_number: updatedUser.address.mobileNumber
        };
        const response: APIResponse = await this.request.put(Environment.UPDATE_ACCOUNT_API_URL, { form: formData, failOnStatusCode: false });
        const body = await response.json() as CustomResponseBodyType;
        return {
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body
        };
    }

    async getUser(email: string): Promise<CustomResponseType> {
        const params = { email: email };
        const response: APIResponse = await this.request.get(Environment.GET_USER_BY_EMAIL_API_URL, { params: params });
        const body = await response.json() as CustomResponseBodyType;
        body.user = {
            id: body.user?.id ?? 0,
            name: body.user?.name ?? EMPTY,
            email: body.user?.email ?? EMPTY,
            title: body.user?.title ?? 'Mr.',
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
        }
        return {
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body,
        };
    }

}