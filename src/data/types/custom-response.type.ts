import { BrandType } from "@data/model/brand.model";
import { ProductType } from "@data/model/product.model";

export interface CustomResponseType {
    statusCode: number,
    statusText: string,
    body: {
        responseCode: number,
        message?: string,
        products?: ProductType[],
        brands?: BrandType[],
    },
}