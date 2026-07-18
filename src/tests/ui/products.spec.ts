import { ProductType } from '@data/model/product.model';
import { GenerateRandomUser, UserType } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { ArraysUtils } from '@utils/arrays.utils';
import { StringUtils } from '@utils/string.utils';

test.describe('Products page validations - UI', {
    tag: ['@products', '@ui']
}, () => {

    test('Verify All Products and product detail page',
        { tag: ['@SAMPLE-0007', '@TC-UI-8'] },
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
                id: 1,
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
            await sharedSteps.navigateToProductView(productsPage, firstProduct.id);
            const productDetails: ProductType = await productSteps.productDetails();
            await productSteps.validateProductDetails(firstProduct, productDetails);
        });

    test('Search Product',
        { tag: ['@SAMPLE-0008', '@TC-UI-9', '@search-products'] },
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

    test('Add review on Product',
        { tag: ['@SAMPLE-0022', '@TC-UI-21', '@review'] },
        async ({
            homePage, productSteps, productsPage, sharedSteps, productApiSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickProducts(homePage.header);
            await sharedSteps.validateTitle('Products');
            const apiProducts = await productApiSteps.all() as ProductType[];
            const selectedProduct = ArraysUtils.getRandomElement(apiProducts);
            await sharedSteps.viewProduct(productsPage, selectedProduct.id);
            const user: UserType = GenerateRandomUser();
            const review: string = StringUtils.generateRandomText({ words: 10 });
            await productSteps.enterReviewName(user.name);
            await productSteps.enterReviewEmail(user.email);
            await productSteps.enterReviewText(review);
            await productSteps.submitReview();
            await productSteps.validateReviewSuccessMessage();
        });

});
