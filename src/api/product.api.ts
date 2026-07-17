import { Environment } from '@configs/environment.config';
import { RUPEES } from '@data/constants/common.constants';
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
                const product = this.parseProduct(responseProduct);
                if (!options?.brand || product.brand === options.brand) {
                    products.push(product);
                }
            }
        }
        return products;
    }

    private parseProduct(responseProduct: any): ProductType {
        return {
            id: responseProduct.id,
            name: responseProduct.name,
            price: +responseProduct.price.replace(RUPEES, EMPTY),
            brand: responseProduct.brand,
            category: {
                usertype: {
                    usertype: responseProduct.category.usertype.usertype
                },
                category: responseProduct.category.category
            }
        };
    }

    async search(options?: { raw?: boolean, search?: string }): Promise<CustomResponseType | ProductType[]> {
        let formData = {};
        if (options?.search) {
            formData = { search_product: options.search }
        }
        const products: ProductType[] = [];
        const response: APIResponse = await this.request.post(Environment.PRODUCT_SEARCH_API_URL, { form: formData });
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
                const product = this.parseProduct(responseProduct);
                products.push(product);
            }
        }
        return products;
    };

}