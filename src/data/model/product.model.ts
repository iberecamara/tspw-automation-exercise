import { ProductCategoryType } from "@data/model/product-category.model";

export interface ProductType {
    index?: number,
    id?: number,
    name: string,
    price: number,
    category?: ProductCategoryType,
    availability?: string,
    quantity?: number,
    totalPrice?: number,
    condition?: string,
    brand?: string
}

