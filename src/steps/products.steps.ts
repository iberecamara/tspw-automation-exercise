import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { ProductsPage } from '@pages/products.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class ProductsSteps {

    readonly logger: TestAutomationLogger;
    readonly productsPage: ProductsPage;

    constructor(logger: TestAutomationLogger, productsPage: ProductsPage) {
        this.logger = logger;
        this.productsPage = productsPage;
    }

    // Actions
    async getProductsCount(): Promise<number> {
        this.logger.debug('Getting the number of Products displayed');
        let count: number = 0;
        await test.step('Getting the number of Products displayed', async () => {
            count = await this.productsPage.product.getProductsCount();
        });
        this.logger.debug(`Found ${count} Products in page`);
        return count;
    }


    async searchProducts(searchTerm: string): Promise<void> {
        this.logger.debug(`Searching for products with '${searchTerm}'.`);
        await test.step('Searching products', async () => {
            await this.productsPage.searchProducts(searchTerm);
        });
        this.logger.debug(`Searched for '${searchTerm}'.`);
    }

    // Validations
    validateDisplayedProductsHaveSearchTerm(products: ProductType[], searchTerm: string): void {
        this.logger.debug(`Validating displayed Products have the search term '${searchTerm}'.`);
        for (const product of products) {
            expect.soft(
                product.name.toLowerCase(),
                `Products should have the search term '${searchTerm}'.`
            ).toContain(searchTerm.toLowerCase());
        }
    }

}