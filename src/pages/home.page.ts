import { BrandsComponent } from '@components/brands.component';
import { CategoriesComponent } from '@components/categories.component';
import { ContinueShoppingViewCartComponent } from '@components/continueshopping-viewcart.component';
import { HeaderComponent } from '@components/header.component';
import { ProductComponent } from '@components/product.component';
import { SubscriptionComponent } from '@components/subscription.component';
import { EMPTY } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { HomeLocators } from '@locators/page/home.locators';
import { BasePage } from '@pages/base.page';
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
        const recommendedItemsLocators: Locator[] = await this.locators.recommendedItemsContainer.locator('.single-products').all();
        for (const locator of recommendedItemsLocators) {
            const id = await locator.locator('a').getAttribute('data-product-id') ?? EMPTY;
            const name = await locator.locator('p').textContent() ?? EMPTY;
            const price = await locator.locator('h2').textContent() ?? EMPTY;
            const product: ProductType = {
                id: +id,
                name: name,
                price: +price.replaceAll('Rs. ', EMPTY)
            }
            recommendedItems.push(product);
        }
        return recommendedItems;
    }

    async addRecommendedItem(item: ProductType): Promise<void> {
        await this.click(this.locators.recommendedItemsContainer.locator(`[data-product-id="${item.id}"]`));
    }

}