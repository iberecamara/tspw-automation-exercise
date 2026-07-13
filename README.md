# Vanilla Playwright Test Automation Framework — Automation Exercise

A TypeScript, vanilla [Playwright](https://playwright.dev/) end-to-end and API test automation framework built against [automationexercise.com](https://automationexercise.com). "Vanilla" means no BDD wrapper (no Cucumber/Gherkin) — the framework relies on Playwright's native test runner, fixtures, and `test.step()` calls, organized through a layered Page Object Model.

> Code created without AI help, to showcase knowledge of the Playwright framework.

**Live Allure report:** available at [iberecamara.github.io/pw-automation-exercise-frontend](https://iberecamara.github.io/pw-automation-exercise-frontend/) after every push/merge to `main` (see [CI/CD](#cicd)).

---

## Table of Contents

- [Project Structure](#project-structure)
  - [Architecture Overview](#architecture-overview)
  - [Layers Explained](#layers-explained)
- [Prerequisites](#prerequisites)
- [Cloning the Project](#cloning-the-project)
- [Installing Dependencies](#installing-dependencies)
- [Environment Configuration](#environment-configuration)
- [Running the Tests](#running-the-tests)
- [Reports](#reports)
- [Extending the Project](#extending-the-project)
  - [Adding a New Page](#adding-a-new-page)
  - [Adding a New Component](#adding-a-new-component)
  - [Adding New Steps](#adding-new-steps)
  - [Adding a New Test](#adding-a-new-test)
  - [Adding a New API Client](#adding-a-new-api-client)
- [CI/CD](#cicd)
- [License](#license)

---

## Project Structure

```
src/
├── api/            # API clients (raw HTTP calls to automationexercise.com/api)
├── components/     # Reusable partial-page objects (header, subscription box, etc.)
├── configs/        # Playwright config, environment/.env parsing, path constants
├── data/           # Constants, TypeScript models/interfaces, response types
├── database/        # (reserved for DB-backed test data, if/when needed)
├── exceptions/     # Custom error types
├── files/          # Static fixture files used for upload/download tests
├── fixtures/       # Playwright fixture composition (pages, steps, api, logging)
├── global/         # Global setup/teardown hooks
├── locators/       # Raw Playwright Locator definitions, one file per page/component
├── pages/          # Page Object classes — one per application page
├── reporters/      # Custom Playwright reporters (e.g. Allure results cleanup)
├── steps/          # Business-readable "step" wrappers around page actions, used in tests
├── tests/          # Spec files — what actually runs under `npm test`
└── utils/          # Cross-cutting utilities (logger, datetime, allure, strings, arrays…)
```

### Architecture Overview

The framework follows a **layered Page Object Model** where each layer has a single responsibility, and tests are composed by combining small, reusable pieces rather than one another's internals directly:

```
tests/*.spec.ts
   │  calls
   ▼
steps/*.steps.ts        (readable, logged, test.step()-wrapped business actions/validations)
   │  calls
   ▼
pages/*.page.ts         (page-level actions; may delegate to components/)
   │  composes
   ▼
components/*.components.ts   (reusable partial-page objects, e.g. Header, Subscription box)
   │  uses
   ▼
locators/*.locators.ts  (raw Locator definitions — the only place selectors live)
```

Everything ultimately extends `pages/base.page.ts`, which wraps common low-level Playwright interactions (`click`, `fill`, `hover`, `checkbox`, `selectOption`, `scroll`, `goToHome`, …) so that pages and components never call `locator.click()` directly — they call `this.click(locator)`. This keeps interaction logic (waits, retries, logging hooks) centralized in one place.

### Layers Explained

#### 1. Locators (`src/locators/`)

Each locator file exports a class (e.g. `HeaderLocators`, `HomeLocators`) whose constructor receives a Playwright `Page` and exposes every selector on that page/component as a `readonly` property, using Playwright's built-in locator strategies (`getByRole`, `getByText`, etc.). Locators are the **only** place where selector strings live — nothing outside this layer should contain a raw CSS/XPath/role selector.

Locators can also be exposed as functions when they're parameterized (e.g. a product card that depends on a product name, or a "logged in as X" text that depends on a username):

```ts
// src/locators/header.locators.ts
export class HeaderLocators {
    readonly homeButton: Locator;
    readonly loggedInText: Function;

    constructor(page: Page) {
        this.homeButton = page.getByRole('link', { name: ' Home' });
        this.loggedInText = (username: string): Locator =>
            page.getByText(`Logged in as ${username}`);
    }
}
```

#### 2. Components (`src/components/`)

Components are **partial pages** — pieces of UI (like the site header/navbar, or the newsletter subscription box) that appear identically on *multiple* pages. A component:

- Extends `BasePage` (so it gets `click`, `fill`, etc.)
- Owns its own `locators` instance
- Exposes actions scoped to that piece of UI only (e.g. `clickHome()`, `clickLogout()`, `clickCart()`)

```ts
// src/components/header.components.ts
export class HeaderComponents extends BasePage {
    readonly locators: HeaderLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new HeaderLocators(page);
    }

    async clickCart(): Promise<void> {
        await this.click(this.locators.cartLink);
    }
    // ...
}
```

Because the header appears on virtually every page of the site, **every page object that needs it simply instantiates `HeaderComponents` in its own constructor**, instead of duplicating header locators/actions in every page:

```ts
// src/pages/home.page.ts
export class HomePage extends BasePage {
    readonly locators: HomeLocators;
    readonly header: HeaderComponents;
    readonly subscription: SubscriptionComponents;

    constructor(page: Page) {
        super(page);
        this.locators = new HomeLocators(page);
        this.header = new HeaderComponents(page);
        this.subscription = new SubscriptionComponents(page);
    }
}
```

A test then reaches into the composed component through the page object, e.g. `homePage.header.clickCart()` or `cartPage.subscription.enterSubscriptionEmail(...)`. This is the key mechanism that avoids duplicating "shared UI" logic across every page class — add a component once, then compose it into every page that needs it.

#### 3. Pages (`src/pages/`)

One class per distinct application page/screen (`HomePage`, `ProductsPage`, `ProductPage`, `CartPage`, `CheckoutPage`, `SignupPage`, …). A page object:

- Extends `BasePage`
- Owns a `locators` instance for elements unique to that page
- Composes any shared `components` it needs (header, subscription, etc.)
- Exposes page-specific actions and data-retrieval methods (e.g. `ProductsPage.getProducts()`, `ProductsPage.searchProducts()`)

Pages never contain assertions or `test.step()` calls — that belongs to the Steps layer.

#### 4. Steps (`src/steps/`)

Steps are the business-readable layer that tests actually call. Each `*.steps.ts` file groups related **actions** and **validations** as methods, typically taking a `TestAutomationLogger` plus the relevant page/component/data as parameters. Every step:

- Wraps its logic in Playwright's `test.step(...)` for readable trace/report output
- Logs via the injected `TestAutomationLogger` (debug-level before/after)
- Uses `expect.soft(...)` for validations, so a single test can report multiple failed assertions instead of stopping at the first one

```ts
// src/steps/shared.steps.ts
async clickCart(logger: TestAutomationLogger, actions: HeaderComponents): Promise<void> {
    logger.debug('Clicking "Cart" in header');
    await test.step('Click "Cart" in header', async () => {
        await actions.clickCart();
    });
    logger.debug('Clicked "Cart" in header');
}
```

`shared.steps.ts` specifically holds steps that are reused across many spec files (navigation, header clicks, subscription flow, cart-adding flow), while the other `*.steps.ts` files hold steps specific to one page/flow (e.g. `products.steps.ts`, `checkout.steps.ts`).

#### 5. Fixtures (`src/fixtures/`)

Playwright's [fixture](https://playwright.dev/docs/test-fixtures) mechanism is used to auto-inject every page, step, and API client into tests, so specs never do manual `new HomePage(page)` construction. Fixtures are split by concern and merged together:

| File | Provides |
|---|---|
| `pages.fixtures.ts` | One fixture per Page Object (`homePage`, `cartPage`, `checkoutPage`, …), plus an auto-running `adblocker` route interceptor |
| `steps.fixtures.ts` | One fixture per Steps class (`homeSteps`, `sharedSteps`, `productsSteps`, …) |
| `api.fixtures.ts` | One fixture per API client (`userApi`, `productApi`) |
| `logging.fixtures.ts` | `logger` fixture (per-worker `TestAutomationLogger`), plus `autologger`/`logError` auto-fixtures that log test start/end and dump errors |
| `fixtures.ts` | Merges all of the above via `mergeTests()` into the single `test` object every spec imports |

A spec file only ever imports `test` from `@fixtures/fixtures` and destructures whichever fixtures it needs from the test callback arguments:

```ts
test('Search Product', { tag: ['@SAMPLE-0008', '@TC9', '@products'] },
    async ({ logger, page, homeSteps, homePage, productsSteps, productsPage, sharedSteps }) => {
        await sharedSteps.navigateHome(logger, homePage);
        await productsSteps.searchProducts(logger, productsPage, 'blue');
        // ...
    });
```

#### 6. Tests (`src/tests/`)

Spec files (`*.spec.ts`) are intentionally thin: they read as a sequence of step calls with minimal branching logic, tagged with Jira-style IDs and feature tags (`{ tag: ['@SAMPLE-0007', '@TC8', '@products'] }`) used for filtering (`@smoke`, `@sanity`, etc.) and for the `SET_JIRA_TAG` helper in `Environment`.

#### 7. Supporting layers

- **`data/`** — `constants/` (magic strings/numbers), `model/` (TS interfaces like `UserType`, `ProductType`, `AddressType`), and `types/` (API response shapes).
- **`api/`** — Thin classes wrapping raw HTTP calls to `automationexercise.com/api` via Playwright's `APIRequestContext` (used for fast test-data setup/teardown, e.g. creating/deleting a user without going through the UI).
- **`configs/`** — `environment.config.ts` loads and validates `.env` values with Joi and exposes them as a static `Environment` class; `playwright.config.ts` is the actual Playwright configuration; `paths.ts` centralizes filesystem paths (artifacts/reports/allure directories) so they aren't hardcoded in multiple places.
- **`utils/`** — `logger.utils.ts` (Winston-based `TestAutomationLogger`, singleton per worker), `allure.utils.ts` (`AllureUtils` class wrapping the `allure` CLI — generate/open/export/cleanup reports), plus small helpers (`datetime.utils.ts`, `string.utils.ts`, `number.utils.ts`, `arrays.utils.ts`).
- **`reporters/`** — Custom Playwright reporters, e.g. `allure-cleanup.reporter.ts`, which removes stale Allure result files matching `ALLURE_REPORT_REMOVE_STATUS` after a run.
- **`global/`** — `global.teardown.ts`, run once after the whole suite finishes (currently splits/finalizes generated logs).
- **`exceptions/`** — `TestAutomationException`, thrown by framework code when methods are misused (e.g. calling `getProductDetails()` without either a locator or a product name).
- **`files/`** — Static files (e.g. `sample_file.pdf`) plus filepath helpers for tests that exercise file upload/download.

### Path Aliases

The project uses TypeScript path aliases (configured in `tsconfig.json`) instead of long relative imports:

| Alias | Resolves to |
|---|---|
| `@api/*` | `src/api/*` |
| `@components/*` | `src/components/*` |
| `@configs/*` | `src/configs/*` |
| `@data/*` | `src/data/*` |
| `@files/*` | `src/files/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@locators/*` | `src/locators/*` |
| `@pages/*` | `src/pages/*` |
| `@steps/*` | `src/steps/*` |
| `@utils/*` | `src/utils/*` |

When running via `ts-node` (e.g. the `report:*` npm scripts), these aliases are resolved at runtime through `tsconfig-paths/register`.

---

## Prerequisites

- **Node.js** (LTS recommended — the CI workflow uses `lts/*`)
- **npm** (bundled with Node.js)
- **Git**

## Cloning the Project

```bash
git clone https://github.com/iberecamara/pw-automation-exercise.git
cd pw-automation-exercise
```

## Installing Dependencies

Install the npm packages:

```bash
npm install
```

Then install the Playwright browser binaries (Chromium is the only configured project, but this installs all supported browsers by default):

```bash
npx playwright install
```

> On Linux you may also need OS-level dependencies: `npx playwright install-deps`

## Environment Configuration

The framework reads configuration from a `.env` file at the project root (git-ignored — you need to create your own; you can also use `.env.<APPLICATION_ENVIRONMENT>` for environment-specific overrides). At minimum:

```env
APPLICATION=Automation Exercise
JIRA_BOARD=SAMPLE
```

All variables are validated on startup via `Joi` in `src/configs/environment.config.ts` — an invalid or missing required variable (like `APPLICATION`) will throw immediately rather than fail silently later. `VIEWPORT_HEIGHT`/`VIEWPORT_WIDTH` are optional and, if omitted, Playwright uses its device default.

## Running the Tests

All commands run through `npx playwright test` under the hood, with the configuration file pointed at `src/configs/playwright.config.ts`.

| Command | Description |
|---|---|
| `npm test` | Run the full suite |
| `npm run test:pwui` | Run the full suite in Playwright's interactive UI mode |
| `npm run test:ui` | Run only tests tagged `@ui` |
| `npm run test:pwui:ui` | `@ui` tests in UI mode |
| `npm run test:api` | Run only tests tagged `@api` |
| `npm run test:ui:api` | `@api` tests in UI mode |

You can pass any additional Playwright CLI flags after `--`, e.g.:

```bash
npm test -- --project=chromium --grep "Search Product"
npm test -- --headed --workers=1
```

Tests are also filterable by any custom tag defined on them (e.g. `@products`, `@TC8`, `@SAMPLE-0007`):

```bash
npm test -- --grep "(?=.*@products)"
```

### Cleaning artifacts

```bash
npm run clean:logs      # removes artifacts/logs/*
npm run clean:reports   # removes artifacts/reports/*
npm run clean           # both of the above
```

## Reports

The suite produces three report formats simultaneously (configured in `playwright.config.ts`):

- **Playwright HTML report** → `artifacts/reports/html`
- **JSON report** → `artifacts/reports/json/report.json`
- **Allure results** → `artifacts/reports/allure/allure-results`

Allure reports are generated/opened through the `AllureUtils` class (`src/utils/allure.utils.ts`), exposed as npm scripts:

| Command | Description |
|---|---|
| `npm run report:generate` | Generates the multi-page Allure HTML report from raw results |
| `npm run report:open` | Opens the generated Allure report |
| `npm run report` | Generates and opens the report in one step |
| `npm run report:export` | Generates a single-file, portable Allure report (used by CI, uploaded as an artifact and published to GitHub Pages) |

`AllureUtils` is also usable programmatically elsewhere in the codebase:

```ts
import { AllureUtils } from '@utils/allure.utils';
await AllureUtils.generate();
```

A `AllureCleanupReporter` (`src/reporters/allure-cleanup.reporter.ts`) automatically prunes Allure result entries whose status matches `ALLURE_REPORT_REMOVE_STATUS` (comma-separated, e.g. `passed,skipped`) after every run, keeping the report focused on actionable results.

### Logs

Structured logs (via Winston) are written per worker under `artifacts/logs/`, and the global teardown (`src/global/global.teardown.ts`) finalizes/splits them at the end of a run. Set `LOG_CONSOLE=true` in `.env` to also stream logs to stdout during execution.

---

## Extending the Project

The general rule: **add the selector in `locators/`, add the behavior in `pages/` or `components/`, add the readable/logged wrapper in `steps/`, then use it from a spec in `tests/`.** Never skip a layer (e.g. don't call a raw `Locator` from a spec file).

### Adding a New Page

1. **Locators** — create `src/locators/<page-name>.locators.ts`, exporting a class that takes `Page` in its constructor and exposes every needed `Locator` (or locator-returning function for parameterized elements).
2. **Page object** — create `src/pages/<page-name>.page.ts`, extending `BasePage`:
   ```ts
   export class MyNewPage extends BasePage {
       readonly locators: MyNewLocators;
       readonly header: HeaderComponents; // compose shared components as needed

       constructor(page: Page) {
           super(page);
           this.locators = new MyNewLocators(page);
           this.header = new HeaderComponents(page);
       }

       async doSomething(): Promise<void> {
           await this.click(this.locators.someButton);
       }
   }
   ```
3. **Register the fixture** — add it to `PageFixtures` in `src/fixtures/pages.fixtures.ts`:
   ```ts
   myNewPage: createPageFixture(MyNewPage),
   ```

### Adding a New Component

Use this when a piece of UI is shared by two or more pages (e.g. a footer, a modal, a filter sidebar).

1. **Locators** — `src/locators/<component-name>.locators.ts`, same pattern as page locators.
2. **Component** — `src/components/<component-name>.components.ts`, extending `BasePage`, exposing only actions scoped to that UI fragment.
3. **Compose it** into every page object that displays it, as a `readonly` property instantiated in the constructor (see `HeaderComponents`/`SubscriptionComponents` usage in `home.page.ts`).

### Adding New Steps

1. Add a method to an existing `*.steps.ts` file (if it belongs to an existing flow) or create `src/steps/<name>.steps.ts` exporting a class for a new flow.
2. Each method should:
   - Accept `logger: TestAutomationLogger` as the first parameter, plus the page/component and any data it needs.
   - Wrap its core logic in `await test.step('<readable description>', async () => { ... })`.
   - Log a `debug` line before and after (or `info` for higher-level actions).
   - For validations, use `expect.soft(...)` with a descriptive message so failures are readable in the report without halting the rest of the test.
3. If it's a new class, register it in `StepsFixtures` in `src/fixtures/steps.fixtures.ts`.

### Adding a New Test

1. Create `src/tests/<feature>.spec.ts`.
2. Import `test` from `@fixtures/fixtures` (never from `@playwright/test` directly, so all custom fixtures are available).
3. Tag each test with a Jira-style ID and relevant feature tags for filtering:
   ```ts
   test('Descriptive test name', { tag: ['@SAMPLE-00XX', '@TCXX', '@feature-tag'] },
       async ({ logger, page, homeSteps, homePage, sharedSteps /* ...whatever fixtures you need */ }) => {
           await sharedSteps.navigateHome(logger, homePage);
           // compose steps here — the spec itself should read like a script, not contain raw Playwright calls
       });
   ```
4. Add `@smoke` and/or `@sanity` tags if the test should be included in those filtered runs.

### Adding a New API Client

1. Create `src/api/<resource>.api.ts`, exporting a class whose constructor takes an `APIRequestContext` and exposes methods per endpoint (see `user.api.ts` / `product.api.ts` for the pattern, including simple retry handling).
2. Add any new endpoint URLs to `Environment` in `src/configs/environment.config.ts`.
3. Register the client in `ApiFixtures` in `src/fixtures/api.fixtures.ts`.

### Adding Constants / Models

- Shared magic strings/numbers go in `src/data/constants/`.
- New TypeScript interfaces describing domain entities (e.g. a new `OrderType`) go in `src/data/model/`.
- API response shapes go in `src/data/types/`.

---

## CI/CD

`.github/workflows/playwright.yml` runs on every push/PR to `main` (and manually via `workflow_dispatch`):

1. Installs dependencies and Playwright browsers (with caching).
2. Runs `npm test`.
3. Generates a single-file Allure report (`npm run report:export`).
4. Uploads the Allure report and logs as workflow artifacts.
5. Publishes the Allure report to [**GitHub Pages**](https://iberecamara.github.io/pw-automation-exercise/) is available after the GitHub Action execute (after a push or merge on main branch). on `main`: 
6. Fails the job explicitly if any test failed, even though report generation always runs first (`continue-on-error` on the test step ensures reports are produced regardless of pass/fail).

## License

See [LICENSE](./LICENSE).

