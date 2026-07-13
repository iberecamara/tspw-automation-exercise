import { GenerateRandomContactUsData } from '@data/model/contact-us.model';
import { test } from '@fixtures/fixtures';

test.describe('Contact Us form', async () => {

    test('Contact Us Form',
        { tag: ['@SAMPLE-0009', '@TC6', '@contact-us'] },
        async ({
            logger, page, homeSteps, homePage, contactUsPage, contactUsSteps, sharedSteps
        }) => {
            await sharedSteps.navigateHome(logger, homePage);
            await sharedSteps.validateTitle(logger, page, 'Home');
            await sharedSteps.clickContactUs(logger, homePage.header);
            await sharedSteps.validateTitle(logger, page, 'Contact Us');
            await contactUsSteps.validateGetInTouchText(logger, contactUsPage);
            await contactUsSteps.enterContactFormData(logger, contactUsPage, GenerateRandomContactUsData({ file: 'sample_file.pdf' }));
            await contactUsSteps.clickSubmit(logger, contactUsPage, { accept: true });
            await contactUsSteps.validateSubmitSuccessMessage(logger, contactUsPage);
            await contactUsSteps.clickHome(logger, contactUsPage);
            await sharedSteps.validateTitle(logger, page, 'Home');
        });

});
