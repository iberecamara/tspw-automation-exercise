import { Environment } from '@configs/environment.config';
import { MINUTE_IN_MILISSECONDS } from '@data/constants/common.constants';
import { UserType } from '@data/model/user.model';
import { ResponseType } from '@data/types/response.type';
import { APIRequestContext, APIResponse } from 'playwright-core';

export class UserApi {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createUser(user: UserType, options?: { retries?: number }): Promise<ResponseType> {
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
        let response: APIResponse = await this.request.post(Environment.CREATE_ACCOUNT_API_URL, { form: formData, failOnStatusCode: false });
        if (options?.retries && response.status() !== 201) {
            for (let index = 0; index < options?.retries; index++) {
                response = await this.request.post(Environment.CREATE_ACCOUNT_API_URL, { form: formData, failOnStatusCode: false, timeout: (index + 1) * (3 * MINUTE_IN_MILISSECONDS) });
            }
        }
        const body = await response.json();
        return {
            responseCode: body.responseCode,
            message: body.message
        };
    }

    async deleteUser(email: string, password: string, options?: { retries?: number }): Promise<ResponseType> {
        const formData = {
            email: email,
            password: password
        }
        let response: APIResponse = await this.request.delete(Environment.DELETE_ACCOUNT_API_URL, { form: formData });
        if (options?.retries && response.status() !== 200) {
            for (let index = 0; index < options?.retries; index++) {
                response = await this.request.delete(Environment.DELETE_ACCOUNT_API_URL, { form: formData, timeout: (index + 1) * (3 * MINUTE_IN_MILISSECONDS) });
            }
        }
        const body = await response.json();
        return {
            responseCode: body.responseCode,
            message: body.message
        };
    }

}