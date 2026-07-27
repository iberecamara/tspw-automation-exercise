import { Environment } from "@configs/environment.config";
import { PAGES_TITLES } from "@data/constants/constants";
import { SitePages } from "@data/types/site-pages.type";
import { BasePage } from "@pages.base/base.page";
import { expect, Page } from "@playwright/test";
import { BaseSteps } from "@steps/ui/common/base.steps";

export class CommonSteps extends BaseSteps {
  readonly page: Page;

  constructor(page: Page) {
    super();
    this.page = page;
  }

  // Actions
  async navigateHome<T extends BasePage>(pageObject: T): Promise<void> {
    this.logger.verbose(
      `Navigating to home page at '${Environment.BASE_URL}'.`,
    );
    await this.step("Navigate to application home page", async () => {
      await pageObject.goToHome();
    });
  }

  async scrolling<T extends BasePage>(
    pageObject: T,
    direction: "down" | "up",
  ): Promise<void> {
    await this.step(
      `Scrolling to ${direction.toLowerCase() === "down" ? "bottom" : "top"} of page.`,
      async () => {
        await pageObject.scroll(direction);
      },
    );
  }

  // Validations
  async validateTitle(sitePage: SitePages): Promise<void> {
    await this.step(
      `Validate that application ${sitePage} page have the expected title`,
      async () => {
        await expect
          .soft(
            this.page,
            `${sitePage} page should have the expected title: ${PAGES_TITLES[sitePage]} `,
          )
          .toHaveTitle(PAGES_TITLES[sitePage]);
      },
    );
  }

  async validateTitleDirectly(pageName: string, title: string): Promise<void> {
    await this.step(
      `Validate that application ${pageName} page have the expected title`,
      async () => {
        await expect
          .soft(
            this.page,
            `${pageName} page should have the expected title: ${title} `,
          )
          .toHaveTitle(title);
      },
    );
  }
}
