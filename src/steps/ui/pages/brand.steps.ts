import { BrandPage } from "@pages/brand.page";
import { BaseSteps } from "@steps/base.steps";

/** Readable, logged steps driving {@link BrandPage}. Currently defines no steps of its own beyond construction — tests exercising the brand page instead use `BrandComponentSteps` and `ProductListingComponentSteps` for their actual actions/validations. */
export class BrandSteps extends BaseSteps {
  readonly brandPage: BrandPage;

  constructor(brandPage: BrandPage) {
    super();
    this.brandPage = brandPage;
  }
}
