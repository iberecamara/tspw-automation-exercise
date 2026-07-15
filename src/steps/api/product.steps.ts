import { ProductApi } from '@api/product.api';
import { EMPTY } from '@data/constants/string.constants';
import { ProductType } from '@data/model/product.model';
import { test } from '@fixtures/fixtures';
import { TestAutomationLogger } from '@utils/logger.utils';

export class ProductApiSteps {

    readonly logger: TestAutomationLogger;
    readonly productApi: ProductApi;

    constructor(logger: TestAutomationLogger, productApi: ProductApi) {
        this.logger = logger;
        this.productApi = productApi;
    }

    async getAllProducts(options?: { brand?: string }): Promise<ProductType[]> {
        this.logger.debug('Retrieving all products from API.');
        const products: ProductType[] = [];
        await test.step('Retrieve all products from API.', async () => {
            products.push(...await this.productApi.all(options));
        });
        this.logger.debug(`Retrieved ${products.length} product${products.length > 1 ? 's' : EMPTY} from API.`);
        return products;
    }

}