import { SitePages } from "@data/types/site-pages.type";
import { BaseSteps } from "@steps/base.steps";
import { Locator, Page } from "playwright";
import { expect } from "playwright/test";

export class VisualSteps extends BaseSteps {
  readonly page: Page;

  constructor(page: Page) {
    super();
    this.page = page;
  }

  async validatePageScreenshot(
    webPage: SitePages,
    screenshot: string,
  ): Promise<void> {
    await this.step(`Validate visual regression for ${webPage}`, async () => {
      await expect(
        this.page,
        `${webPage} screenshot should match existing one '${screenshot}'.`,
      ).toHaveScreenshot(screenshot);
    });
  }

  async validateElementScreenshot(
    element: Locator,
    elementName: string,
    screenshot: string,
  ): Promise<void> {
    await this.step(
      `Validate visual regression for ${elementName} element`,
      async () => {
        await element.scrollIntoViewIfNeeded();
        await expect(
          element,
          `${elementName} element screenshot should match existing one '${screenshot}'.`,
        ).toHaveScreenshot(screenshot);
      },
    );
  }
}
