import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { ProductPage } from '@pages/product.page';
import { expect } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';
import { StringUtils } from '@utils/string.utils';

export class ProductSteps {

    readonly logger: TestAutomationLogger;
    readonly productPage: ProductPage;

    constructor(logger: TestAutomationLogger, productPage: ProductPage) {
        this.logger = logger;
        this.productPage = productPage;
    }

    // Actions
    async setProductQuantity(quantity: number): Promise<void> {
        this.logger.debug(`Setting product quantity to ${quantity}`);
        await test.step('Set product quantity', async () => {
            await this.productPage.setQuantity(quantity);
        });
        this.logger.debug(`Set product quantity to ${quantity}`);
    }

    async addToCart(): Promise<void> {
        this.logger.debug('Adding product to cart');
        await test.step('Add product to cart', async () => {
            await this.productPage.clickAddToCart();
        });
        this.logger.debug('Added product to cart');
    }

    async viewCart(): Promise<void> {
        this.logger.debug('Clicking View Cart');
        await test.step('Navigating to cart from modal', async () => {
            await this.productPage.continueShoppingViewCart.clickViewCart();
        });
        this.logger.debug('Clicked View Cart');
    }

    async productDetails(): Promise<ProductType> {
        this.logger.debug('Retrieving product details');
        let product;
        await test.step('Retrieve product details', async () => {
            product = await this.productPage.getProductDetails();
        });
        this.logger.debug('Retrieved product details');
        return product!;
    }


    // Validations
    async validateProductDetails(firstProduct: ProductType, productDetails: ProductType): Promise<void> {
        this.logger.debug('Validating that retrieved product matches the first product.');
        this.logger.debug(`First product: ${StringUtils.prettyJson(firstProduct)}`);
        this.logger.debug(`Retrieved product: ${StringUtils.prettyJson(productDetails)}`);
        await test.step('Validate that retrieved product matches the first product', async () => {
            expect.soft(
                productDetails,
                'Retrieved product should match the first product'
            ).toStrictEqual(firstProduct);
        });
    }

}