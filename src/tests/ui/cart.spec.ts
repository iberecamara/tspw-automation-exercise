import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { NumberUtils } from '@utils/number.utils';

test.describe('Cart validations', async () => {

    test('Add Products in Cart',
        { tag: ['@SAMPLE-0010', '@TC12', '@products', '@cart'] },
        async ({
            page, homePage, productsPage, sharedSteps, cartSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            await sharedSteps.clickProducts(homePage.header);
            await sharedSteps.validateTitle(page, 'Products');

            const quantity = 1;

            const firstProductName = 'Blue Top';
            const firstProductData: ProductType = await sharedSteps.getProductDetails(productsPage, firstProductName);
            firstProductData.index = 1;
            firstProductData.quantity = quantity;
            firstProductData.category = {
                usertype: { usertype: 'Women' },
                category: 'Tops'
            };
            firstProductData.totalPrice = firstProductData.quantity * firstProductData.price;

            const secondProductName = 'Men Tshirt';
            const secondProductData: ProductType = await sharedSteps.getProductDetails(productsPage, secondProductName);
            secondProductData.index = 2;
            secondProductData.quantity = quantity;
            secondProductData.category = {
                usertype: { usertype: 'Men' },
                category: 'Tshirts'
            };
            secondProductData.totalPrice = secondProductData.quantity * secondProductData.price;

            await sharedSteps.hoverProduct(productsPage, firstProductName);
            await sharedSteps.addProductToCartFromHover(productsPage, firstProductName);
            await sharedSteps.continueShopping(productsPage);
            await sharedSteps.hoverProduct(productsPage, secondProductName);
            await sharedSteps.addProductToCartFromHover(productsPage, secondProductName);
            await sharedSteps.continueShopping(productsPage);
            await sharedSteps.clickCart(productsPage.header);
            const items = await cartSteps.getCartProducts();
            await cartSteps.validateCartItems(items, [firstProductData, secondProductData]);
        });

    test('Verify Product quantity in Cart',
        { tag: ['@SAMPLE-0011', '@TC13', '@products', '@cart'] },
        async ({
            page, homePage, productSteps, sharedSteps, cartSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle(page, 'Home');
            const randomIndex = NumberUtils.getRandomNumber({ min: 1, max: 34 });
            await sharedSteps.viewProduct(homePage, randomIndex);
            await sharedSteps.validateTitle(page, 'Product');
            const quantity = 4;
            await productSteps.setProductQuantity(quantity);
            await productSteps.addToCart();
            await productSteps.viewCart();
            await cartSteps.validateProductQuantity(quantity);
        });

});
