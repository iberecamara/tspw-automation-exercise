import { BaseApi } from "@apis/base.api";
import { Environment } from "@configs/environment.config";
import { RUPEES } from "@data/constants/common.constants";
import { EMPTY } from "@data/constants/string.constants";
import { ProductType } from "@data/model/product.model";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { ProductResponseType } from "@data/types/product-response.type";
import { APIResponse } from "@playwright/test";
import { prettyJson } from "@utils/string.utils";

export class ProductApi extends BaseApi {
  async all(options?: {
    raw?: boolean;
    method?: "POST" | "GET";
    brand?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    const products: ProductType[] = [];
    const method = options?.method ?? "GET";
    const response: APIResponse = await this.request.fetch(
      Environment.PRODUCT_LIST_API_URL,
      { method: method },
    );
    const body = (await response.json()) as CustomResponseBodyType;
    this.logger.debug(
      `Response [${response.status()} ${response.url()}]: ${
        body ? prettyJson(body) : "<no JSON body>"
      }`,
    );
    if (options?.raw) {
      return {
        statusCode: response.status(),
        statusText: response.statusText(),
        body: body,
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

  private parseProduct(responseProduct: ProductResponseType): ProductType {
    return {
      id: responseProduct.id,
      name: responseProduct.name,
      price: +responseProduct.price.replace(RUPEES, EMPTY),
      brand: responseProduct.brand,
      category: {
        usertype: {
          usertype: responseProduct.category.usertype.usertype,
        },
        category: responseProduct.category.category,
      },
    };
  }

  async search(options?: {
    raw?: boolean;
    search?: string;
  }): Promise<CustomResponseType | ProductType[]> {
    let formData = {};
    if (options?.search) {
      formData = { search_product: options.search };
    }
    const products: ProductType[] = [];
    const response: APIResponse = await this.request.post(
      Environment.PRODUCT_SEARCH_API_URL,
      { form: formData },
    );
    const body = (await response.json()) as CustomResponseBodyType;
    this.logger.debug(
      `Response [${response.status()} ${response.url()}]: ${
        body ? prettyJson(body) : "<no JSON body>"
      }`,
    );
    if (options?.raw) {
      return {
        statusCode: response.status(),
        statusText: response.statusText(),
        body: body,
      };
    }
    if (response.ok() && body.products) {
      for (const responseProduct of body.products) {
        const product = this.parseProduct(responseProduct);
        products.push(product);
      }
    }
    return products;
  }
}
