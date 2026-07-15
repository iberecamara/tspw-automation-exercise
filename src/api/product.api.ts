import { Environment } from '@configs/environment.config';
import { EMPTY } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class ProductApi {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async all(options?: { brand?: string }): Promise<ProductType[]> {
        const products: ProductType[] = [];
        const response: APIResponse = await this.request.get(Environment.PRODUCT_LIST_API_URL);
        if (response.ok()) {
            const body = await response.json();
            if (body.products) {
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
        }
        return products;
    }

}