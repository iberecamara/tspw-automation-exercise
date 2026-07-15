import { Locator, Page } from '@playwright/test';

export class ProductLocators {

    readonly productDetailContainer: Locator;
    readonly productQuantityInput: Locator;
    readonly addToCartButton: Locator;
    readonly continueShoppingButton: Locator;
    readonly writeReviewHeading: Locator;
    readonly writeReviewName: Locator;
    readonly writeReviewEmail: Locator;
    readonly writeReviewText: Locator;
    readonly submitReviewButton: Locator;
    readonly reviewSuccessMessage: Locator;

    constructor(page: Page) {
        this.productDetailContainer = page.locator('.product-details');
        this.productQuantityInput = page.locator('#quantity');
        this.addToCartButton = page.getByRole('button', { name: ' Add to cart' });
        this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
        this.writeReviewHeading = page.getByText('Write Your Review');
        this.writeReviewName = page.getByPlaceholder('Your Name', { exact: true });
        this.writeReviewEmail = page.getByPlaceholder('Email Address', { exact: true });
        this.writeReviewText = page.getByPlaceholder('Add Review Here!');
        this.submitReviewButton = page.getByRole('button', { name: 'Submit' });
        this.reviewSuccessMessage = page.getByText('Thank you for your review.', { exact: true })
    }

}