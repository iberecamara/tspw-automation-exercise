import { DOWN } from '@data/constants/common.constants';
import { SPACE } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { GenerateRandomUser } from '@data/model/user.model';
import { test } from '@fixtures/fixtures';
import { ArraysUtils } from '@utils/arrays.utils';
import { NumberUtils } from '@utils/number.utils';
import { StringUtils } from '@utils/string.utils';

test.describe('Cart validations - UI', {
    tag: ['@products', '@cart', '@ui']
}, async () => {

    test('Add Products in Cart',
        { tag: ['@SAMPLE-0010', '@TC-UI-12'] },
        async ({
            homePage, productsPage, sharedSteps, cartSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickProducts(homePage.header);
            await sharedSteps.validateTitle('Products');

            const quantity = 1;

            const firstProductName = 'Blue Top';
            const firstProductData: ProductType = await sharedSteps.getProductDetails(productsPage, firstProductName);
            firstProductData.id = 1;
            firstProductData.quantity = quantity;
            firstProductData.category = {
                usertype: { usertype: 'Women' },
                category: 'Tops'
            };
            firstProductData.totalPrice = firstProductData.quantity * firstProductData.price;

            const secondProductName = 'Men Tshirt';
            const secondProductData: ProductType = await sharedSteps.getProductDetails(productsPage, secondProductName);
            secondProductData.id = 2;
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
        { tag: ['@SAMPLE-0011', '@TC-UI-13'] },
        async ({
            homePage, productSteps, sharedSteps, cartSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            const randomIndex = NumberUtils.getRandomNumber({ min: 1, max: 34 });
            await sharedSteps.viewProduct(homePage, randomIndex);
            await sharedSteps.validateTitle('Product');
            const quantity = 4;
            await productSteps.setProductQuantity(quantity);
            await productSteps.addToCart();
            await productSteps.viewCart();
            await cartSteps.validateProductQuantity(quantity);
        });

    test('Remove Products from Cart',
        { tag: ['@SAMPLE-0018', '@TC-UI-17'] },
        async ({
            homePage, productApiSteps, sharedSteps, cartSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            const products = await productApiSteps.all() as ProductType[];
            const selectedProducts = await sharedSteps.selectRandomProducts(products);
            await sharedSteps.addProductsToCart(homePage, selectedProducts);
            await sharedSteps.clickCart(homePage.header);
            await sharedSteps.validateTitle('Cart');
            await cartSteps.removeProducts(selectedProducts);
            const cartProducts = await cartSteps.getCartProducts();
            await cartSteps.validateCartItems(cartProducts, []);
        });

    test('Search Products and Verify Cart After Login',
        { tag: ['@SAMPLE-0021', '@TC-UI-20'] },
        async ({
            homePage, userApiSteps, productApiSteps, sharedSteps, productsPage, productsSteps, cartSteps, cartPage, signupLoginSteps
        }) => {

            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickProducts(homePage.header);
            await sharedSteps.validateTitle('Products');
            const apiProducts = await productApiSteps.all() as ProductType[];
            const selectedProduct = ArraysUtils.getRandomElement(apiProducts);
            const searchTerm: string = selectedProduct.name.split(SPACE)[0];
            await productsSteps.searchProducts(searchTerm);
            const products: ProductType[] = await sharedSteps.getProducts(productsPage);
            productsSteps.validateDisplayedProductsHaveSearchTerm(products, searchTerm);
            await sharedSteps.addProductsToCart(productsPage, products);
            await sharedSteps.clickCart(homePage.header);
            await sharedSteps.validateTitle('Cart');
            const cartProducts = await cartSteps.getCartProducts();
            await sharedSteps.validateProductsByName(products, cartProducts);
            await sharedSteps.clickSignupLogin(cartPage.header);
            const user = GenerateRandomUser();
            await userApiSteps.createAccount(user);
            await signupLoginSteps.login(user);
            await sharedSteps.clickCart(homePage.header);
            await sharedSteps.validateTitle('Cart');
            const loggedCartProducts = await cartSteps.getCartProducts();
            await sharedSteps.validateProductsByName(products, loggedCartProducts);
        });

    test('Add to cart from Recommended items',
        { tag: ['@SAMPLE-0023', '@TC-UI-22'] },
        async ({
            homePage, homeSteps, sharedSteps, cartSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.scrolling(homePage, DOWN);
            await homeSteps.validateRecommendedItems();
            const recommendedItems: ProductType[] = await homeSteps.getRecommendedItems();
            const item: ProductType = ArraysUtils.getRandomElement(recommendedItems);
            await homeSteps.addRecommendedItem(item);
            await sharedSteps.continueShopping(homePage);
            await sharedSteps.clickCart(homePage.header);
            await sharedSteps.validateTitle('Cart');
            const cartItems: ProductType[] = await cartSteps.getCartProducts();
            console.log(StringUtils.prettyJson(cartItems))
            await cartSteps.validateCartItems(cartItems, [item], { partial: true });
        });

});
