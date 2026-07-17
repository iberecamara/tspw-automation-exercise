import { test } from '@fixtures/fixtures';
import { ArraysUtils } from '@utils/arrays.utils';

test.describe('Categories validations - UI', {
    tag: ['@categories', '@ui']
}, async () => {

    test('View Category Products',
        { tag: ['@SAMPLE-0019', '@TC-UI-18'] },
        async ({
            homePage, sharedSteps, categorySteps, categoryPage
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.validateCategorySection(homePage);
            let category = 'Women';
            await sharedSteps.expandCategory(homePage, category);
            let subcategories = await sharedSteps.getSubCategories(homePage, category);
            let subcategory = ArraysUtils.getRandomElement(subcategories);
            await sharedSteps.selectSubCategory(homePage, subcategory);
            await sharedSteps.validateTitleDirectly('Category', `Automation Exercise - ${subcategory} Products`);
            await categorySteps.validateCategoryPageHeading(category, subcategory);
            category = 'Men';
            await sharedSteps.expandCategory(homePage, category);
            subcategories = await sharedSteps.getSubCategories(homePage, category);
            subcategory = ArraysUtils.getRandomElement(subcategories);
            await sharedSteps.selectSubCategory(categoryPage, subcategory);
            await sharedSteps.validateTitleDirectly('Category', `Automation Exercise - ${subcategory} Products`);
            await categorySteps.validateCategoryPageHeading(category, subcategory);
        });

});
