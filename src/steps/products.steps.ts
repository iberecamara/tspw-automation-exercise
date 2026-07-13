import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { ProductsPage } from '@pages/products.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

export class ProductsSteps {

    // Actions
    async getProductsCount(logger: TestAutomationLogger, productsPage: ProductsPage): Promise<number> {
        logger.debug('Getting the number of Products displayed');
        let count: number = 0;
        await test.step('Getting the number of Products displayed', async () => {
            count = await productsPage.product.getProductsCount();
        });
        logger.debug(`Found ${count} Products in page`);
        return count;
    }


    async searchProducts(logger: TestAutomationLogger, productsPage: ProductsPage, searchTerm: string): Promise<void> {
        logger.debug(`Searching for products with '${searchTerm}'.`);
        await test.step('Searching products', async () => {
            await productsPage.searchProducts(searchTerm);
        });
        logger.debug(`Searched for '${searchTerm}'.`);
    }

    // Validations
    validateDisplayedProductsHaveSearchTerm(logger: TestAutomationLogger, products: ProductType[], searchTerm: string): void {
        logger.debug(`Validating displayed Products have the search term '${searchTerm}'.`);
        for (const product of products) {
            expect.soft(
                product.name.toLowerCase(),
                `Products should have the search term '${searchTerm}'.`
            ).toContain(searchTerm.toLowerCase());
        }
    }

}