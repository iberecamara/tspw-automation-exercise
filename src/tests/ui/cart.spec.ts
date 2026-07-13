import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { NumberUtils } from '@utils/number.utils';

test.describe('Cart validations', async () => {

    test('Add Products in Cart',
        { tag: ['@SAMPLE-0010', '@TC12', '@products', '@cart'] },
        async ({
            logger, page, homeSteps, homePage, productsSteps, productsPage, sharedSteps, cartPage, cartSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await homeSteps.validateHomeTitle(logger, page);
            await sharedSteps.clickProducts(logger, homePage.header);
            await productsSteps.validateProductsTitle(logger, page);

            const quantity = 1;

            const firstProductName = 'Blue Top';
            const firstProductData: ProductType = await productsSteps.getProductDetails(logger, productsPage, firstProductName);
            firstProductData.index = 1;
            firstProductData.quantity = quantity;
            firstProductData.category = {
                usertype: { usertype: 'Women' },
                category: 'Tops'
            };
            firstProductData.totalPrice = firstProductData.quantity * firstProductData.price;

            const secondProductName = 'Men Tshirt';
            const secondProductData: ProductType = await productsSteps.getProductDetails(logger, productsPage, secondProductName);
            secondProductData.index = 2;
            secondProductData.quantity = quantity;
            secondProductData.category = {
                usertype: { usertype: 'Men' },
                category: 'Tshirts'
            };
            secondProductData.totalPrice = secondProductData.quantity * secondProductData.price;

            await sharedSteps.hoverProduct(logger, productsPage, firstProductName);
            await sharedSteps.addProductToCartFromHover(logger, productsPage, firstProductName);
            await sharedSteps.continueShopping(logger, productsPage);
            await sharedSteps.hoverProduct(logger, productsPage, secondProductName);
            await sharedSteps.addProductToCartFromHover(logger, productsPage, secondProductName);
            await sharedSteps.continueShopping(logger, productsPage);
            await sharedSteps.clickCart(logger, productsPage.header);
            const items = await cartSteps.getCartProducts(logger, cartPage);
            await cartSteps.validateCartItems(logger, items, [firstProductData, secondProductData]);
        });

    test('Verify Product quantity in Cart',
        { tag: ['@SAMPLE-0011', '@TC13', '@products', '@cart'] },
        async ({
            logger, page, homeSteps, homePage, productSteps, productPage, sharedSteps, cartPage, cartSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await homeSteps.validateHomeTitle(logger, page);
            const randomIndex = NumberUtils.getRandomNumber({ min: 1, max: 34 });
            await homeSteps.viewProduct(logger, homePage, randomIndex);
            await productSteps.validateProductDetailsTitle(logger, page);
            const quantity = 4;
            await productSteps.setProductQuantity(logger, productPage, quantity);
            await productSteps.addToCart(logger, productPage);
            await productSteps.viewCart(logger, productPage);
            await cartSteps.validateProductQuantity(logger, cartPage, quantity);
        });

});
