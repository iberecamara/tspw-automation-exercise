import { Environment } from "@configs/environment.config";
import { BrandType } from "@data/model/brand.model";
import {
  CustomResponseBodyType,
  CustomResponseType,
} from "@data/types/custom-response.type";
import { APIRequestContext, APIResponse } from "@playwright/test";

export class BrandApi {
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

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
