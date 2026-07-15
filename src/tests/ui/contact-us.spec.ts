import { GenerateRandomContactUsData } from '@data/model/contact-us.model';
import { test } from '@fixtures/fixtures';

test.describe('Contact Us form', async () => {

    test('Contact Us Form',
        { tag: ['@SAMPLE-0009', '@TC6', '@contact-us'] },
        async ({
            homePage, contactUsSteps, sharedSteps
        }) => {
            await sharedSteps.navigateHome(homePage);
            await sharedSteps.validateTitle('Home');
            await sharedSteps.clickContactUs(homePage.header);
            await sharedSteps.validateTitle('Contact Us');
            await contactUsSteps.validateGetInTouchText();
            await contactUsSteps.enterContactFormData(GenerateRandomContactUsData({ file: 'sample_file.pdf' }));
            await contactUsSteps.clickSubmit({ accept: true });
            await contactUsSteps.validateSubmitSuccessMessage();
            await contactUsSteps.clickHome();
            await sharedSteps.validateTitle('Home');
        });

});
