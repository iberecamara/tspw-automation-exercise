import { Environment } from '@configs/environment.config';
import { EMPTY } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { CustomResponseType } from '@data/types/custom-response.type';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ProductApi {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async all(options?: { raw?: boolean, method?: 'POST' | 'GET', brand?: string }): Promise<CustomResponseType | ProductType[]> {
        const products: ProductType[] = [];
        const method = options?.method ?? 'GET';
        const response: APIResponse = await this.request.fetch(Environment.PRODUCT_LIST_API_URL, { method: method });
        const body = await response.json();
        if (options?.raw) {
            return {
                statusCode: response.status(),
                statusText: response.statusText(),
                body: body
            };
        }
        if (response.ok() && body.products) {
            for (const responseProduct of body.products) {
                const product = {
                    id: responseProduct.id,
                    name: responseProduct.name,
                    price: +responseProduct.price.replace('Rs. ', EMPTY),
                    brand: responseProduct.brand,
                    category: {
                        usertype: {
                            usertype: responseProduct.category.usertype.usertype
                        },
                        category: responseProduct.category.category
                    }
                };
                if (!options?.brand || product.brand === options.brand) {
                    products.push(product);
                }
            }
        }
        return products;
    }

}