import { FullConfig } from '@playwright/test';
import { TestAutomationLogger } from '@utils/logger.utils';

async function globalTeardown(config: FullConfig) {
    await TestAutomationLogger.splitGeneratedLogs();
}

export default globalTeardown;
