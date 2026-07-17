import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { ArraysUtils } from '@utils/arrays.utils';

test.describe('Brands validations - UI', {
    tag: ['@brands', '@ui']
}, async () => {

    test('View & Cart Brand Products',
        { tag: ['@SAMPLE-0020', '@TC-UI-19'] },
        async ({
            homePage, sharedSteps, productsPage, brandSteps, brandPage, productApiSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickProducts(homePage.header);
            await sharedSteps.validateBrandSection(productsPage);
            let brands = await sharedSteps.getBrands(productsPage);
            let selectedBrand = ArraysUtils.getRandomElement(brands);
            await sharedSteps.selectBrand(productsPage, selectedBrand);
            await sharedSteps.validateTitleDirectly('Brand', `Automation Exercise - ${selectedBrand} Products`);
            await sharedSteps.validateBrandPageHeading(selectedBrand);
            let products = await sharedSteps.getProducts(brandPage);
            let apiProducts = await productApiSteps.getAllProducts({ brand: selectedBrand }) as ProductType[];
            await sharedSteps.validateProductsByName(products, apiProducts);
            brands = await sharedSteps.getBrands(productsPage);
            selectedBrand = ArraysUtils.getRandomElement(brands, { exclude: [selectedBrand] });
            await sharedSteps.selectBrand(productsPage, selectedBrand);
            await sharedSteps.validateTitleDirectly('Brand', `Automation Exercise - ${selectedBrand} Products`);
            await sharedSteps.validateBrandPageHeading(selectedBrand);
            products = await sharedSteps.getProducts(brandPage);
            apiProducts = await productApiSteps.getAllProducts({ brand: selectedBrand }) as ProductType[];
            await sharedSteps.validateProductsByName(products, apiProducts);
        });

});
