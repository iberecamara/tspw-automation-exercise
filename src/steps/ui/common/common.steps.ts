import {
  PAGES_TITLES,
  SECOND_IN_MILLISECONDS,
} from "@data/constants/constants";
import { SitePages } from "@data/types/site-pages.type";
import { BasePage } from "@pages.base/base.page";
import { expect, Locator, Page } from "@playwright/test";
import { BaseSteps } from "@steps/base.steps";

/** Navigation and validation steps reused across many spec files (home navigation, scrolling, page-title assertions), rather than belonging to any single page. */
export class CommonSteps extends BaseSteps {
  readonly page: Page;

  constructor(page: Page) {
    super();
    this.page = page;
  }

  // Actions

  /**
   * Navigates any page object to the application's home page.
   *
   */
  /**
   * Navigates to the application's home page, relative to the configured `baseURL`
   * (`Environment.BASE_URL`, wired into `playwright.config.ts`'s `use.baseURL`).
   *
   * @param options - Optional navigation overrides, forwarded to `page.goto()`. Defaults to a
   * 30-second timeout unless overridden.
   */
  async navigateHome(options?: {
    referer?: string;
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit";
  }): Promise<void> {
    await this.page.goto("/", {
      timeout: 30 * SECOND_IN_MILLISECONDS,
      ...options,
    });
  }

  /**
   * Smoothly scrolls the page from one end to the other.
   *
   * @param pageObject - Any page object (used only for its `scroll()`, inherited from `BasePage`).
   * @param direction - `"down"` scrolls to the bottom; `"up"` scrolls to the top.
   */
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

  /**
   * Scrolls to a element via locator, putting it into the viewport.
   *
   * @param element - Any page element.
   * @param elementName - The element name.
   */
  async scrollToElement(element: Locator, elementName: string): Promise<void> {
    await this.step(`Scrolling to ${elementName}.`, async () => {
      await element.scrollIntoViewIfNeeded();
    });
  }

  // Validations

  /**
   * Validates the browser tab's title matches the expected title for a known site page.
   *
   * @remarks Hard gate assertion (not `expect.soft`): this is the "did the page actually
   * navigate" checkpoint used after most navigation actions, so a failure here should stop the
   * test immediately rather than let it wander through subsequent page-specific steps on the
   * wrong page.
   *
   * @param sitePage - Which page's expected title (from {@link PAGES_TITLES}) to assert against.
   */
  async validateTitle(sitePage: SitePages): Promise<void> {
    await this.step(
      `Validate that application ${sitePage} page have the expected title`,
      async () => {
        await expect(
          this.page,
          `${sitePage} page should have the expected title: ${PAGES_TITLES[sitePage]} `,
        ).toHaveTitle(PAGES_TITLES[sitePage]);
      },
    );
  }

  /**
   * Validates the browser tab's title matches an explicitly given title, for pages not covered
   * by {@link SitePages}/{@link PAGES_TITLES}.
   *
   * @remarks Hard gate assertion (not `expect.soft`): this is the "did the page actually
   * navigate" checkpoint used after most navigation actions, so a failure here should stop the
   * test immediately rather than let it wander through subsequent page-specific steps on the
   * wrong page.
   *
   * @param pageName - Readable page name, used only in the step/log/failure-message text.
   * @param title - The exact expected title.
   */
  async validateTitleDirectly(pageName: string, title: string): Promise<void> {
    await this.step(
      `Validate that application ${pageName} page have the expected title`,
      async () => {
        await expect(
          this.page,
          `${pageName} page should have the expected title: ${title} `,
        ).toHaveTitle(title);
      },
    );
  }
}
