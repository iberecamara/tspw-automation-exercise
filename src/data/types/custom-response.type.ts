import { BrandType } from "@data/model/brand.model";
import { ProductType } from "@data/model/product.model";
import { UserType } from "@data/model/user.model";

export interface CustomResponseType {
    statusCode: number,
    statusText: string,
    body: {
        responseCode: number,
        message?: string,
        products?: ProductType[],
        brands?: BrandType[],
        user?: UserType
    },
}