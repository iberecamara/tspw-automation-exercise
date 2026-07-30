import { test } from "@fixtures/fixtures";
import { capitalize } from "@utils/string.utils";

test.describe(
  "User registration validations - UI",
  {
    tag: ["@user-register", "@ui"],
  },
  () => {
    test(
      "Register user",
      { tag: ["@SAMPLE-0013", "@TC-UI-1"] },
      async ({
        unregisteredUser,
        signupLoginSteps,
        signupSteps,
        accountCreatedDeletedSteps,
        commonSteps,
        headerComponentSteps,
      }) => {
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickSignupLogin();
        await signupLoginSteps.validateNewUserSignupText();
        await signupLoginSteps.enterSignupData(unregisteredUser);
        await signupLoginSteps.clickSignup();
        await signupSteps.validateEnterAccountInformationText();
        await signupSteps.enterSignupData(unregisteredUser);
        await signupSteps.clickCreateAccount();
        await accountCreatedDeletedSteps.validateAccountActionText("created");
        await accountCreatedDeletedSteps.clickContinue(capitalize("created"));
        await headerComponentSteps.validateUserLoggedText(unregisteredUser);
      },
    );

    test(
      "Register User with existing email",
      { tag: ["@SAMPLE-0014", "@TC-UI-5", "@user-register-error"] },
      async ({
        registeredUser,
        signupLoginSteps,
        userApiSteps,
        commonSteps,
        headerComponentSteps,
      }) => {
        await userApiSteps.createAccount(registeredUser);
        await commonSteps.navigateHome();
        await commonSteps.validateTitle("Home");
        await headerComponentSteps.clickSignupLogin();
        await signupLoginSteps.validateNewUserSignupText();
        await signupLoginSteps.enterSignupData(registeredUser);
        await signupLoginSteps.clickSignup();
        await signupLoginSteps.validateEmailAlreadyExistsMessage();
      },
    );
  },
);
