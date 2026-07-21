import { HeaderComponent } from "@components/header.component";
import { Environment } from "@configs/environment.config";
import { EMPTY, PAGES_TITLES } from "@data/constants/constants";
import { ProductType } from "@data/model/product.model";
import { UserType } from "@data/model/user.model";
import { SitePages } from "@data/types/site-pages.type";
import { faker } from "@faker-js/faker";
import { test } from "@fixtures/fixtures";
import { BasePage } from "@pages.base/base.page";
import { BrandPage } from "@pages/brand.page";
import { CartPage } from "@pages/cart.page";
import { CategoryPage } from "@pages/category.page";
import { HomePage } from "@pages/home.page";
import { ProductPage } from "@pages/product.page";
import { ProductsPage } from "@pages/products.page";
import { expect, Page } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";
import { ArraysUtils } from "@utils/arrays.utils";

export class SharedSteps extends BaseSteps {
  readonly page: Page;

  constructor(page: Page) {
    super();
    this.page = page;
  }

  // Actions
  async navigateHome<T extends BasePage>(pageObject: T): Promise<void> {
    this.logger.verbose(`Navigating to home page at '${Environment.BASE_URL}'.`);

    await test.step("Navigate to application home page", async () => {
      await pageObject.goToHome();
    });

    this.logger.verbose("Navigated to home page.");
  }

  async clickHome(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Clicking 'Home' button in header`);

    await test.step(`Click 'Home' button in header`, async () => {
      await header.clickHome();
    });

    this.logger.verbose(`Clicked 'Home' button in header`);
  }

  async clickSignupLogin(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Clicking 'Signup / Login' button in header`);

    await test.step(`Click 'Signup / Login' button in header`, async () => {
      await header.clickSignupLogin();
    });

    this.logger.verbose(`Clicked 'Signup / Login' button in header`);
  }

  async clickDeleteAccount(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Clicking 'Delete Account' in header`);

    await test.step(`Click 'Delete Account' in header`, async () => {
      await header.clickDeleteAccount();
    });

    this.logger.verbose(`Clicked 'Delete Account' in header`);
  }

  async clickLogout(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Clicking 'Logout' in header`);

    await test.step(`Click 'Logout' in header`, async () => {
      await header.clickLogout();
    });

    this.logger.verbose(`Clicked 'Logout' in header`);
  }

  async clickContactUs(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Clicking 'Contact us' in header`);

    await test.step(`Click 'Contact us' in header`, async () => {
      await header.clickContactUs();
    });

    this.logger.verbose(`Clicked 'Contact us' in header`);
  }

  async clickTestCases(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Clicking 'Test Cases' in header`);

    await test.step(`Click 'Test Cases' in header`, async () => {
      await header.clickTestCases();
    });

    this.logger.verbose(`Clicked 'Test Cases' in header`);
  }

  async clickProducts(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Cicking 'Products' in header`);

    await test.step(`Click 'Products' in header`, async () => {
      await header.clickProducts();
    });

    this.logger.verbose(`Clicked 'Products' in header`);
  }

  async clickCart(header: HeaderComponent): Promise<void> {
    this.logger.verbose(`Clicking 'Cart' in header`);

    await test.step(`Click 'Cart' in header`, async () => {
      await header.clickCart();
    });

    this.logger.verbose(`Clicked 'Cart' in header`);
  }

  async scrolling<T extends BasePage>(
    pageObject: T,
    direction: "down" | "up",
  ): Promise<void> {
    this.logger.verbose(
      `Scrolling to ${direction.toLowerCase() === "down" ? "bottom" : "top"} of page.`,
    );

    await test.step(`Scrolling to ${direction.toLowerCase() === "down" ? "bottom" : "top"} of page.`, async () => {
      await pageObject.scroll(direction);
    });

    this.logger.verbose(
      `Scrolled to ${direction.toLowerCase() === "down" ? "bottom" : "top"} of page.`,
    );
  }

  async subscribeEmail(
    pageObject: HomePage | CartPage,
    email: string,
  ): Promise<void> {
    this.logger.verbose("Subscribing email in page");
    this.logger.verbose(`Using email '${email}'`);

    await test.step("Subscribing email in page", async () => {
      await pageObject.subscription.enterSubscriptionEmail(email);
      await pageObject.subscription.clickSubscribe();
    });

    this.logger.verbose("Subscribed email in page");
  }

  async continueShopping(
    pageObject: HomePage | ProductsPage | ProductPage,
  ): Promise<void> {
    this.logger.verbose("Clicking Continue Shopping.");

    await test.step("Click Continue Shopping", async () => {
      await pageObject.continueShoppingViewCart.clickContinueShopping();
    });

    this.logger.verbose("Clicked Continue Shopping.");
  }

  async hoverProduct(
    pageObject: HomePage | ProductsPage,
    productName: string,
  ): Promise<void> {
    this.logger.verbose(`Hovering over product '${productName}'.`);

    await test.step(`Hover over product '${productName}'.`, async () => {
      await pageObject.products.hoverProduct(productName);
    });

    this.logger.verbose(`Hovered over product '${productName}'.`);
  }

  async addProductToCartFromHover(
    pageObject: HomePage | ProductsPage,
    productName: string,
  ): Promise<void> {
    this.logger.verbose(
      `Adding product '${productName}' to cart from hover overlay.`,
    );

    await test.step(`Add product '${productName}' to cart from hover overlay.`, async () => {
      await pageObject.products.clickAddToCartFromHover(productName);
    });

    this.logger.verbose(
      `Added product '${productName}' to cart from hover overlay.`,
    );
  }

  async addProductsToCart(
    pageObject: HomePage | ProductsPage,
    products: ProductType[],
  ): Promise<void> {
    this.logger.verbose(`Adding ${products.length} products to cart.`);

    await test.step(`Add ${products.length} products to cart`, async () => {
      for (const product of products) {
        await this.hoverProduct(pageObject, product.name);
        await this.addProductToCartFromHover(pageObject, product.name);
        await this.continueShopping(pageObject);
      }
    });

    this.logger.verbose(`Added ${products.length} products to cart.`);
  }

  async selectRandomProducts(products: ProductType[]): Promise<ProductType[]> {
    const quantity = faker.number.int({ min: 1, max: 3 });
    const selectedProducts: ProductType[] = [];
    this.logger.verbose(`Selecting ${quantity} products from the list.`);

    await test.step(`Select ${quantity} products from the list`, () => {
      const count = 1;
      selectedProducts.push(
        ...ArraysUtils.getRandomElements(products, {
          quantity: quantity,
          indexLimit: 10,
        }),
      );
      this.logger.verbose(`Adding ${count} to each product quantity.`);
      this.logger.verbose(
        `Adding ${count} times product price to each product total price.`,
      );
      this.logger.verbose(
        `Removing unecessary 'brand' field from each product to match validations.`,
      );
      for (const product of selectedProducts) {
        product.quantity = 1;
        product.totalPrice = 1 * product.price;
        delete product.brand;
      }
    });

    this.logger.verbose(`Selected ${quantity} products from the list.`);
    return selectedProducts;
  }

  async viewProduct(
    pageObject: HomePage | ProductsPage,
    productIndex: number,
  ): Promise<void> {
    this.logger.verbose(`Clicking 'View Product'`);

    await test.step(`Click 'View Product'`, async () => {
      await pageObject.products.clickProductView(productIndex);
    });

    this.logger.verbose(`Clicked 'View Product'`);
  }

  async getProducts(
    pageObject: ProductsPage | HomePage | BrandPage,
  ): Promise<ProductType[]> {
    this.logger.verbose("Retrieving all products details");
    const products: ProductType[] = [];

    await test.step("Retrieve all products", async () => {
      products.push(...(await pageObject.products.getProducts()));
    });

    this.logger.verbose("Retrieved all products details");
    return products;
  }

  async getProductDetails(
    pageObject: ProductsPage | HomePage | ProductPage,
    productName: string,
  ): Promise<ProductType> {
    this.logger.verbose(`Retrieving products details for '${productName}'.`);
    let product: ProductType = { name: EMPTY, price: 0 };

    await test.step(`Retrieve product details for '${productName}'`, async () => {
      product = await pageObject.products.getProductDetails({
        productName: productName,
      });
    });

    this.logger.verbose(`Retried products details for '${productName}'.`);
    return product;
  }

  async getProductsCount(pageObject: ProductsPage | HomePage): Promise<number> {
    this.logger.verbose("Getting the number of Products displayed");
    let count: number = 0;

    await test.step("Getting the number of Products displayed", async () => {
      count = await pageObject.products.getProductsCount();
    });

    this.logger.verbose(`Found ${count} Products in page`);
    return count;
  }

  async expandCategory(
    pageObject: HomePage | CategoryPage,
    category: string,
  ): Promise<void> {
    this.logger.verbose(`Expanding Category ${category}`);

    await test.step(`Expand Category ${category}`, async () => {
      await pageObject.categories.expandCategory(category);
    });

    this.logger.verbose(`Expanded Category ${category}`);
  }

  async getSubCategories(
    pageObject: HomePage | CategoryPage,
    category: string,
  ): Promise<string[]> {
    this.logger.verbose(`Retrieving Category ${category} subcategories`);
    const subcategories: string[] = [];

    await test.step(`Retrieve Category ${category} subcategories`, async () => {
      subcategories.push(
        ...(await pageObject.categories.getSubCategories(category)),
      );
    });

    this.logger.verbose(`Retrieved Category ${category} subcategories`);
    return subcategories;
  }

  async selectSubCategory(
    pageObject: HomePage | CategoryPage,
    subCategory: string,
  ): Promise<void> {
    this.logger.verbose(`Selecting Sub Category ${subCategory}`);

    await test.step(`Selecting Sub Category ${subCategory}`, async () => {
      await pageObject.categories.selectSubCategory(subCategory);
    });

    this.logger.verbose(`Selected Sub Category ${subCategory}`);
  }

  async selectBrand(
    pageObject: HomePage | BrandPage | ProductsPage,
    brand: string,
  ): Promise<void> {
    this.logger.verbose(`Selecting '${brand}' brand`);

    await test.step(`Selecting ${brand} brand`, async () => {
      await pageObject.brands.selectBrand(brand);
    });

    this.logger.verbose(`Selected ${brand} brand`);
  }

  async getBrands(
    pageObject: HomePage | ProductsPage | BrandPage,
  ): Promise<string[]> {
    this.logger.verbose(`Retrieving Brands`);
    const brands: string[] = [];

    await test.step(`Retrieve Brands`, async () => {
      brands.push(...(await pageObject.brands.getBrands()));
    });

    this.logger.verbose(`Retrieved Brands`);
    return brands;
  }

  // Validations
  async validateSubscriptionHeading(
    pageObject: HomePage | CartPage,
  ): Promise<void> {
    this.logger.verbose("Validating that page have the Subscription heading");

    await test.step("Validate that page have the Subscription heading", async () => {
      await expect
        .soft(
          pageObject.subscription.locators.subscriptionHeading,
          "Page should have the expected Subscription heading",
        )
        .toBeVisible();
    });
  }

  async validateProductsCount(
    count: number,
    expectedCount: number,
  ): Promise<void> {
    this.logger.verbose("Validating count of Products in page.");

    await test.step("Validate that Products page have the expected amout of products", () => {
      expect
        .soft(count, "Products page should have the expected amout of products")
        .toBe(expectedCount);
    });
  }

  async validateProductsByName(
    products: ProductType[],
    expectedProducts: ProductType[],
  ): Promise<void> {
    this.logger.verbose("Validating that list of Products match by name.");

    await test.step("Validate that list of Products match by name", () => {
      for (const expectedProduct of expectedProducts) {
        expect
          .soft(
            products.filter(
              (product: ProductType) => product.name === expectedProduct.name,
            ),
            "Products names must match",
          )
          .toBeTruthy();
      }
    });
  }

  async validateSubscriptionMessage(
    pageObject: HomePage | CartPage,
  ): Promise<void> {
    this.logger.verbose("Validating that the Subscription message is displayed");

    await test.step("Validate that the Subscription message is displayed", async () => {
      await expect
        .soft(
          pageObject.subscription.locators.subscriptionMessage,
          "Subscription message should be displayed",
        )
        .toBeVisible();
    });
  }

  async validateUserLoggedText(
    header: HeaderComponent,
    user: UserType,
  ): Promise<void> {
    this.logger.verbose(
      `Validating that 'Logged in as <username> ' text is displayed`,
    );

    await test.step(`Validate that 'Logged in as <username> ' text is displayed`, async () => {
      await expect
        .soft(
          header.locators.loggedInText(user.name),
          `'Logged in as ${user.name}' text should be visible`,
        )
        .toBeVisible();
    });
  }

  async validateTitle(sitePage: SitePages): Promise<void> {
    this.logger.verbose(
      `Validating that application ${sitePage} page have the expected title`,
    );

    await test.step(`Validate that application ${sitePage} page have the expected title`, async () => {
      await expect
        .soft(
          this.page,
          `${sitePage} page should have the expected title: ${PAGES_TITLES[sitePage]} `,
        )
        .toHaveTitle(PAGES_TITLES[sitePage]);
    });
  }

  async validateTitleDirectly(pageName: string, title: string): Promise<void> {
    this.logger.verbose(
      `Validating that application ${pageName} page have the expected title`,
    );

    await test.step(`Validate that application ${pageName} page have the expected title`, async () => {
      await expect
        .soft(
          this.page,
          `${pageName} page should have the expected title: ${title} `,
        )
        .toHaveTitle(title);
    });
  }

  async validateCategorySection(
    pageObject: HomePage | CategoryPage,
  ): Promise<void> {
    this.logger.verbose(
      `Validating that Category Section have the expected heading`,
    );

    await test.step(`Validate that Category Section have the expected heading`, async () => {
      await expect
        .soft(
          pageObject.categories.locators.categoriesHeading,
          "Categories section should be displayed.",
        )
        .toBeVisible();
    });
  }

  async validateBrandSection(
    pageObject: HomePage | ProductsPage | BrandPage,
  ): Promise<void> {
    this.logger.verbose(
      `Validating that Brand Section have the expected heading`,
    );

    await test.step(`Validate that Brand Section have the expected heading`, async () => {
      await expect
        .soft(
          pageObject.brands.locators.brandsHeading,
          "Brands section should be displayed.",
        )
        .toBeVisible();
    });
  }

  async validateBrandPageHeading(brand: string): Promise<void> {
    this.logger.verbose(`Validating Brand heading for ${brand}.`);
    const headingText = `Brand - ${brand} Products`;

    await test.step(`Validate Brand heading for ${brand}.`, async () => {
      await expect
        .soft(
          this.page.getByText(headingText),
          `Brand page heading should match the expected '${headingText}'.`,
        )
        .toBeVisible();
    });
  }
}
