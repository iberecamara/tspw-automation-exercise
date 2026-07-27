import { test } from "@fixtures/fixtures";
import { getRandomElement } from "@utils/arrays.utils";

test.describe(
  "Categories validations - UI",
  {
    tag: ["@categories", "@ui"],
  },
  () => {
    test(
      "View Category Products",
      { tag: ["@SAMPLE-0019", "@TC-UI-18"] },
      async ({
        homePage,
        commonSteps,
        categorySteps,
        categoryPage,
        categoryComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await categoryComponentSteps.validateCategorySection(homePage);
        let category = "Women";
        await categoryComponentSteps.expandCategory(homePage, category);
        let subcategories = await categoryComponentSteps.getSubCategories(
          homePage,
          category,
        );
        let subcategory = getRandomElement(subcategories);
        await categoryComponentSteps.selectSubCategory(homePage, subcategory);
        await commonSteps.validateTitleDirectly(
          "Category",
          `Automation Exercise - ${subcategory} Products`,
        );
        await categorySteps.validateCategoryPageHeading(category, subcategory);
        category = "Men";
        await categoryComponentSteps.expandCategory(homePage, category);
        subcategories = await categoryComponentSteps.getSubCategories(
          homePage,
          category,
        );
        subcategory = getRandomElement(subcategories);
        await categoryComponentSteps.selectSubCategory(
          categoryPage,
          subcategory,
        );
        await commonSteps.validateTitleDirectly(
          "Category",
          `Automation Exercise - ${subcategory} Products`,
        );
        await categorySteps.validateCategoryPageHeading(category, subcategory);
      },
    );
  },
);
