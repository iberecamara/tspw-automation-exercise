import { CartComponent } from '@components/cart.component';
import { HeaderComponent } from '@components/header.component';
import { SubscriptionComponent } from '@components/subscription.component';
import { CartLocators } from '@locators/page/cart.locators';
import { BasePage } from '@pages.base/base.page';
import { Page } from '@playwright/test';

export class CartPage extends BasePage {

    readonly locators: CartLocators;
    readonly header: HeaderComponent;
    readonly subscription: SubscriptionComponent;
    readonly cart: CartComponent;

    constructor(page: Page) {
        super(page);
        this.locators = new CartLocators(page);
        this.header = new HeaderComponent(page);
        this.subscription = new SubscriptionComponent(page);
        this.cart = new CartComponent(page);
    }

}
