import { Locator, Page } from '@playwright/test';

export class HomeLocators {

    readonly productsContainer: Locator;
    readonly productViewLink: (index: number) => Locator;
    readonly productLocator: (name: string) => Locator;
    readonly indexOffset = 1;
    readonly recommendedItemsHeading: Locator;
    readonly recommendedItemsContainer: Locator;
    readonly recommendedItemsProducts: Locator;
    readonly recommendedProductsId: (locator: Locator) => Locator;
    readonly recommendedProductsName: (locator: Locator) => Locator;
    readonly recommendedProductsPrice: (locator: Locator) => Locator;
    readonly addRecommendedItem: (id: number) => Locator;
    readonly subheading: Locator;
    readonly scrollUpButton: Locator;

    constructor(page: Page) {
        this.productsContainer = page.locator('.features_items');
        this.productLocator = (name: string): Locator => {
            return page.locator('.single-products').filter({ hasText: name });
        };
        this.productViewLink = (index: number): Locator => {
            return page.getByRole('link', { name: ' View Product' }).nth(index - this.indexOffset);
        };
        this.recommendedItemsHeading = page.getByRole('heading', { name: 'recommended items' });
        this.recommendedItemsContainer = page.locator('#recommended-item-carousel');
        this.recommendedItemsProducts = this.recommendedItemsContainer.locator('.item.active .productinfo');
        this.recommendedProductsId = (locator: Locator) => { return locator.locator('a') };
        this.recommendedProductsName = (locator: Locator) => { return locator.locator('p') };
        this.recommendedProductsPrice = (locator: Locator) => { return locator.locator('h2') };
        this.addRecommendedItem = (id: number) => { return page.locator(`.item.active a[data-product-id="${id}"]`).filter({ visible: true }) }
        this.subheading = page.getByRole('heading', { name: 'Full-Fledged practice website' });
        this.scrollUpButton = page.locator('#scrollUp');
    }

}