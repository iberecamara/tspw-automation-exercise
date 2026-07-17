import { CustomResponseType } from '@data/types/custom-response.type';
import { test } from '@fixtures/fixtures';
import { StringUtils } from '@utils/string.utils';

test.describe('Products validations - API', {
    tag: ['@products', '@api']
}, async () => {

    test('Get All Products List',
        { tag: ['@SAMPLE-0028', '@TC-API-1'] },
        async ({
            productApiSteps
        }) => {
            const response: CustomResponseType = await productApiSteps.all({ raw: true }) as CustomResponseType;
            await productApiSteps.validateGetAllProducts(response);
        });

    test('POST To All Products List',
        { tag: ['@SAMPLE-0029', '@TC-API-2'] },
        async ({
            productApiSteps
        }) => {
            const response: CustomResponseType = await productApiSteps.all({ raw: true, method: 'POST' }) as CustomResponseType;
            await productApiSteps.validateMethodNotAllowed(response);
        });

    test('POST To Search Product',
        { tag: ['@SAMPLE-0032', '@TC-API-6'] },
        async ({
            productApiSteps
        }) => {
            const search = 'tshirt';
            const response: CustomResponseType = await productApiSteps.search({ raw: true, search: search }) as CustomResponseType;
            await productApiSteps.validateGetAllProducts(response, { search: search });
        });

    test('POST To Search Product without search_product parameter',
        { tag: ['@SAMPLE-0033', '@TC-API-6'] },
        async ({
            productApiSteps
        }) => {
            const response: CustomResponseType = await productApiSteps.search({ raw: true }) as CustomResponseType;
            console.log(StringUtils.prettyJson(response))
        });

});
