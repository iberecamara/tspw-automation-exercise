import { CustomResponseType } from '@data/types/custom-response.type';
import { test } from '@fixtures/fixtures';

test.describe('Brands validations - API', {
    tag: ['@brands', '@api']
}, () => {

    test('Get All Brands List',
        { tag: ['@SAMPLE-0030', '@TC-API-3'] },
        async ({
            brandApiSteps
        }) => {
            const response: CustomResponseType = await brandApiSteps.getAllBrands({ raw: true }) as CustomResponseType;
            await brandApiSteps.validateGetAllBrands(response);
        });

    test('PUT To All Brands List',
        { tag: ['@SAMPLE-0031', '@TC-API-4'] },
        async ({
            brandApiSteps
        }) => {
            const response: CustomResponseType = await brandApiSteps.getAllBrands({ raw: true, method: 'PUT' }) as CustomResponseType;
            await brandApiSteps.validateMethodNotAllowed(response);
        });

});
