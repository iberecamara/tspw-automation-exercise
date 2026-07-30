import { test } from "@fixtures/fixtures";

test.describe(
  "Contact Us page visual regression - UI",
  {
    tag: ["@contact-us", "@ui", "@visual"],
  },
  () => {
    test(
      "Contact Us page visual regression",
      { tag: ["@SAMPLE-0048", "@TC-VISUAL-8"] },
      async ({
        commonSteps,
        headerComponentSteps,
        contactUsPage,
        visualSteps,
      }) => {
        await commonSteps.navigateHome();
        await headerComponentSteps.clickContactUs();
        await visualSteps.validatePageScreenshot(
          "Contact Us",
          "contact-us-header.png",
        );
        await visualSteps.validateElementScreenshot(
          contactUsPage.locators.contactForm,
          "Contact Us - Contact Form",
          "contact-us-contact-form.png",
        );
        await visualSteps.validateElementScreenshot(
          contactUsPage.locators.feedbackContainer,
          "Contact Us - Feedback",
          "contact-us-feedback.png",
        );
        await visualSteps.validateElementScreenshot(
          contactUsPage.footer.locators.footerContainer,
          "Contact Us - Footer",
          "contact-us-footer.png",
        );
      },
    );
  },
);
