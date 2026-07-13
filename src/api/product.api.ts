import { APIRequestContext, APIResponse } from '@playwright/test';
import { Environment } from '@configs/environment.config';
import { UserType } from '@data/model/user.model';
import { ResponseType } from '@data/types/response.type';
import { ProductType } from '@data/model/product.model';
import { StringUtils } from '@utils/string.utils';
import { EMPTY } from '@data/constants/string.constants';

export class ProductApi {

    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async all(): Promise<ProductType[]> {
        const products: ProductType[] = [];
        const response: APIResponse = await this.request.get(Environment.PRODUCT_LIST_API_URL);
        if (response.ok()) {
            const body = await response.json();
            if (body.products) {
                for (const product of body.products) {
                    products.push({
                        id: product.id,
                        name: product.name,
                        price: +product.price.replace('Rs. ', EMPTY),
                        brand: product.brand,
                        category: {
                            usertype: {
                                usertype: product.category.usertype.usertype
                            },
                            category: product.category.category
                        }
                    });
                }
            }
        }
        return products;
    }


}