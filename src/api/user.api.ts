import { Environment } from '@configs/environment.config';
import { MINUTE_IN_MILISSECONDS } from '@data/constants/common.constants';
import { UserType } from '@data/model/user.model';
import { CustomResponseType } from '@data/types/custom-response.type';
import { APIRequestContext, APIResponse } from 'playwright-core';

export class UserApi {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async createUser(user: UserType, options?: { retries?: number }): Promise<CustomResponseType> {
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
            mobile_number: user.address.mobileNumber as string
        };
        let response: APIResponse = await this.request.post(Environment.CREATE_ACCOUNT_API_URL, { form: formData, failOnStatusCode: false });
        if (options?.retries && response.status() !== 201) {
            for (let index = 0; index < options?.retries; index++) {
                response = await this.request.post(Environment.CREATE_ACCOUNT_API_URL, { form: formData, failOnStatusCode: false, timeout: (index + 1) * (3 * MINUTE_IN_MILISSECONDS) });
            }
        }
        const body = await response.json();
        return {
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body
        };
    }

    async deleteUser(email: string, password: string, options?: { retries?: number }): Promise<CustomResponseType> {
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
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body
        };
    }

    async updateUser(updatedUser: UserType): Promise<CustomResponseType> {
        const formData = {
            name: updatedUser.name,
            email: updatedUser.email,
            password: updatedUser.password,
            title: updatedUser.address.title,
            birthDate: updatedUser.address.birthDate,
            birthMonth: updatedUser.address.birthMonth,
            birthYear: updatedUser.address.birthYear,
            firstname: updatedUser.address.firstname,
            lastname: updatedUser.address.lastname,
            company: updatedUser.address.company,
            addressOne: updatedUser.address.addressOne,
            addressTwo: updatedUser.address.addressTwo,
            country: updatedUser.address.country,
            zipcode: updatedUser.address.zipcode,
            state: updatedUser.address.state,
            city: updatedUser.address.city,
            mobile_number: updatedUser.address.mobileNumber as string
        };
        let response: APIResponse = await this.request.put(Environment.UPDATE_ACCOUNT_API_URL, { form: formData, failOnStatusCode: false });
        const body = await response.json();
        return {
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body
        };
    }

    async getUser(email: string): Promise<CustomResponseType> {
        const params = { email: email };
        let response: APIResponse = await this.request.get(Environment.GET_USER_BY_EMAIL_API_URL, { params: params });
        let body = await response.json();
        body.user = {
            id: body.user.id,
            name: body.user.name,
            email: body.user.email,
            password: body.user.password,
            address: {
                title: body.user.title,
                birthDate: body.user.birth_day,
                birthMonth: body.user.birth_month,
                birthYear: body.user.birth_year,
                firstname: body.user.first_name,
                lastname: body.user.last_name,
                company: body.user.company,
                addressOne: body.user.address1,
                addressTwo: body.user.address2,
                country: body.user.country,
                state: body.user.state,
                city: body.user.city,
                zipcode: body.user.zipcode,
            }
        }
        return {
            statusCode: response.status(),
            statusText: response.statusText(),
            body: body,
        };
    }

}