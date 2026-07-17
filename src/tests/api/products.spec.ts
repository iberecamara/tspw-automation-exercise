import { CustomResponseType } from '@data/types/custom-response.type';
import { test } from '@fixtures/fixtures';

test.describe('Products validations - API', {
    tag: ['@products', '@api']
}, async () => {

    test('Get All Products List',
        { tag: ['@SAMPLE-0028', '@TC-API-1'] },
        async ({
            productApiSteps
        }) => {
            const response: CustomResponseType = await productApiSteps.getAllProducts({ raw: true }) as CustomResponseType;
            await productApiSteps.validateGetAllProducts(response);
        });

    test('POST To All Products List',
        { tag: ['@SAMPLE-0029', '@TC-API-2'] },
        async ({
            productApiSteps
        }) => {
            const response: CustomResponseType = await productApiSteps.getAllProducts({ raw: true, method: 'POST' }) as CustomResponseType;
            await productApiSteps.validateMethodNotAllowed(response);
        });

});
