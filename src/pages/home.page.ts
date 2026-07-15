import { CategoryComponents } from '@components/category.components';
import { ContinueShoppingViewCartComponents } from '@components/continueshopping-viewcart.components';
import { HeaderComponents } from '@components/header.components';
import { ProductComponents } from '@components/product.components';
import { SubscriptionComponents } from '@components/subscription.components';
import { HomeLocators } from '@locators/home.locators';
import { BasePage } from '@pages/base.page';
import { Page } from '@playwright/test';

export class HomePage extends BasePage {

    readonly locators: HomeLocators;
    readonly header: HeaderComponents;
    readonly subscription: SubscriptionComponents;
    readonly product: ProductComponents;
    readonly continueShoppingViewCart: ContinueShoppingViewCartComponents;
    readonly category: CategoryComponents;

    constructor(page: Page) {
        super(page);
        this.locators = new HomeLocators(page);
        this.header = new HeaderComponents(page);
        this.subscription = new SubscriptionComponents(page);
        this.product = new ProductComponents(page);
        this.continueShoppingViewCart = new ContinueShoppingViewCartComponents(page);
        this.category = new CategoryComponents(page);
    }

}