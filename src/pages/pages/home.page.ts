import { BrandsComponent } from '@components/brands.component';
import { CategoriesComponent } from '@components/categories.component';
import { ContinueShoppingViewCartComponent } from '@components/continueshopping-viewcart.component';
import { HeaderComponent } from '@components/header.component';
import { ProductComponent } from '@components/product.component';
import { SubscriptionComponent } from '@components/subscription.component';
import { RUPEES } from '@data/constants/common.constants';
import { EMPTY } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { HomeLocators } from '@locators/page/home.locators';
import { BasePage } from '@pages.base/base.page';
import { Locator, Page } from '@playwright/test';

export class HomePage extends BasePage {

    readonly locators: HomeLocators;
    readonly header: HeaderComponent;
    readonly subscription: SubscriptionComponent;
    readonly products: ProductComponent;
    readonly continueShoppingViewCart: ContinueShoppingViewCartComponent;
    readonly categories: CategoriesComponent;
    readonly brands: BrandsComponent;


    constructor(page: Page) {
        super(page);
        this.locators = new HomeLocators(page);
        this.header = new HeaderComponent(page);
        this.subscription = new SubscriptionComponent(page);
        this.products = new ProductComponent(page);
        this.continueShoppingViewCart = new ContinueShoppingViewCartComponent(page);
        this.categories = new CategoriesComponent(page);
        this.brands = new BrandsComponent(page);
    }

    async getRecommendedItems(): Promise<ProductType[]> {
        const recommendedItems: ProductType[] = [];
        const recommendedItemsLocators: Locator[] = await this.locators.recommendedItemsProducts.all();
        console.log(recommendedItemsLocators.length)
        for (const locator of recommendedItemsLocators) {
            const product: ProductType = await this.parseRecommendedItem(locator);
            recommendedItems.push(product);
        }
        return recommendedItems;
    }

    private async parseRecommendedItem(locator: Locator): Promise<ProductType> {
        const id = await this.locators.recommendedProductsId(locator).getAttribute('data-product-id') ?? EMPTY;
        const name = await this.locators.recommendedProductsName(locator).textContent() ?? EMPTY;
        const price = await this.locators.recommendedProductsPrice(locator).textContent() ?? EMPTY;
        return {
            id: +id,
            name: name,
            price: +price.replaceAll(RUPEES, EMPTY)
        }
    }

    async addRecommendedItem(item: ProductType): Promise<void> {
        await this.click(this.locators.addRecommendedItem(item.id));
    }

}