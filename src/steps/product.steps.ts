import { NEWLINE } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { ProductPage } from '@pages/product.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class ProductSteps {

    // Actions
    async setProductQuantity(logger: TestAutomationLogger, productPage: ProductPage, quantity: number): Promise<void> {
        logger.debug(`Setting product quantity to ${quantity}`);
        await test.step('Set product quantity', async () => {
            await productPage.setQuantity(quantity);
        });
        logger.debug(`Set product quantity to ${quantity}`);
    }

    async addToCart(logger: TestAutomationLogger, productPage: ProductPage): Promise<void> {
        logger.debug('Adding product to cart');
        await test.step('Add product to cart', async () => {
            await productPage.clickAddToCart();
        });
        logger.debug('Added product to cart');
    }

    async viewCart(logger: TestAutomationLogger, productPage: ProductPage): Promise<void> {
        logger.debug('Clicking View Cart');
        await test.step('Navigating to cart from modal', async () => {
            await productPage.continueShoppingViewCart.clickViewCart();
        });
        logger.debug('Clicked View Cart');
    }


    // Validations
    async validateProductDetails(logger: TestAutomationLogger, firstProduct: ProductType, productDetails: ProductType): Promise<void> {
        logger.debug('Validating that retrieved product matches the first product.');
        logger.debug(`First product: ${NEWLINE}${StringUtils.prettyJson(firstProduct)}`);
        logger.debug(`Retrieved product: ${NEWLINE}${StringUtils.prettyJson(productDetails)}`);
        await test.step('Validate that retrieved product matches the first product', async () => {
            expect.soft(
                productDetails,
                'Retrieved product should match the first product'
            ).toStrictEqual(firstProduct);
        });
    }

}