import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';

test.describe('Products page', async () => {

    test('Verify All Products and product detail page',
        { tag: ['@SAMPLE-0007', '@TC8', '@products'] },
        async ({
            homePage, productsSteps, productsPage, productSteps, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickProducts(homePage.header);
            await sharedSteps.validateTitle('Products');
            const count = await productsSteps.getProductsCount();
            const expectedCount = 34;
            await sharedSteps.validateProductsCount(count, expectedCount);
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
            await sharedSteps.navigateToProductView(productsPage, firstProduct.index!);
            const productDetails: ProductType = await productSteps.productDetails();
            await productSteps.validateProductDetails(firstProduct, productDetails);
        });

    test('Search Product',
        { tag: ['@SAMPLE-0008', '@TC9', '@products', '@search-products'] },
        async ({
            homePage, productsSteps, productsPage, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickProducts(homePage.header);
            await sharedSteps.validateTitle('Products');
            const searchTerm: string = 'blue';
            await productsSteps.searchProducts(searchTerm);
            const products: ProductType[] = await sharedSteps.getProducts(productsPage);
            productsSteps.validateDisplayedProductsHaveSearchTerm(products, searchTerm);
        });

});
