import { BrandPage } from "@pages/brand.page";
import { BaseSteps } from "@steps/ui/common/base.steps";

export class BrandSteps extends BaseSteps {
  readonly brandPage: BrandPage;

  constructor(brandPage: BrandPage) {
    super();
    this.brandPage = brandPage;
  }
}
