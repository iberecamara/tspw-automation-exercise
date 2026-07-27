import { generateRandomContactUsData } from "@data/model/contact-us.model";
import { test } from "@fixtures/fixtures";

test.describe(
  "Contact Us form validations - UI",
  {
    tag: ["@contact-us", "@ui"],
  },
  () => {
    test(
      "Contact Us Form",
      { tag: ["@SAMPLE-0009", "@TC-UI-6"] },
      async ({
        homePage,
        contactUsPage,
        contactUsSteps,
        commonSteps,
        headerComponentSteps,
      }) => {
        await commonSteps.navigateHome(homePage);
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickContactUs(homePage.header);
        await commonSteps.validateTitle("Contact Us");
        await contactUsSteps.validateGetInTouchText();
        await contactUsSteps.enterContactFormData(
          generateRandomContactUsData({ file: "sample_file.pdf" }),
        );
        await contactUsSteps.clickSubmit({ accept: true });
        await contactUsSteps.validateSubmitSuccessMessage();
        await headerComponentSteps.clickHome(contactUsPage.header);
        await commonSteps.validateTitle("Home");
      },
    );
  },
);
