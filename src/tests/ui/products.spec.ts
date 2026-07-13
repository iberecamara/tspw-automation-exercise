import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';

test.describe('Products page', async () => {

    test('Verify All Products and product detail page',
        { tag: ['@SAMPLE-0007', '@TC8', '@products'] },
        async ({
            logger, page, homeSteps, homePage, productsSteps, productsPage, productSteps, productPage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await homeSteps.validateHomeTitle(logger, page);
            await sharedSteps.clickProducts(logger, homePage.header);
            await productsSteps.validateProductsTitle(logger, page);
            const count = await productsSteps.getProductsCount(logger, productsPage);
            const expectedCount = 34;
            await productsSteps.validateProductsCount(logger, count, expectedCount);
            const firstProduct: ProductType = {
                index: 1,
                name: 'Blue Top',
                category: {
                    usertype: { usertype: 'Women' },
                    category: 'Tops'
                },
                price: 500,
                availability: 'In Stock',
                condition: 'New',
                brand: 'Polo'
            };
            await productsSteps.navigateToProductView(logger, productsPage, firstProduct.index!);
            const productDetails: ProductType = await productPage.getProductDetails();
            await productSteps.validateProductDetails(logger, firstProduct, productDetails);
        });

    test('Search Product',
        { tag: ['@SAMPLE-0008', '@TC9', '@products', '@search-products'] },
        async ({
            logger, page, homeSteps, homePage, productsSteps, productsPage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await homeSteps.validateHomeTitle(logger, page);
            await sharedSteps.clickProducts(logger, homePage.header);
            await productsSteps.validateProductsTitle(logger, page);
            const searchTerm: string = 'blue';
            await productsSteps.searchProducts(logger, productsPage, searchTerm);
            const products: ProductType[] = await productsSteps.getProducts(logger, productsPage);
            productsSteps.validateDisplayedProductsHaveSearchTerm(logger, products, searchTerm);
        });

});
