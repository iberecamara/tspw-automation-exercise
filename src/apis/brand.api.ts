import { BaseApi } from "@apis/base.api";
import { Environment } from "@configs/environment.config";
import { BrandType } from "@data/model/brand.model";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { APIResponse } from "@playwright/test";
import { prettyJson } from "@utils/string.utils";

export class BrandApi extends BaseApi {
  async all(options?: {
    raw?: boolean;
    method?: "PUT" | "GET";
    brand?: string;
  }): Promise<CustomResponseType | BrandType[]> {
    const brands: BrandType[] = [];
    const method = options?.method ?? "GET";
    const response: APIResponse = await this.request.fetch(
      Environment.BRAND_LIST_API_URL,
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
        const brand = {
          id: responseProduct.id,
          brand: responseProduct.brand,
        };
        brands.push(brand);
      }
    }
    return brands;
  }
}
