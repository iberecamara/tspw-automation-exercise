import { config } from 'dotenv';
import Joi from 'joi';

// Defaults APPLICATION_ENVIRONMENT to dev for .env file processing
if (!process.env.APPLICATION_ENVIRONMENT) {
    process.env.APPLICATION_ENVIRONMENT = 'dev';
}
config({
    path: [
        '.env',
        `.env.${process.env.APPLICATION_ENVIRONMENT}`
    ],
    quiet: true,
    override: true,
});

const VALID_ALLURE_STATUSES = ['passed', 'failed', 'broken', 'skipped', 'unknown'];

const variables = {
    // Playwright variables
    WORKERS: Joi.number().integer().positive().empty('').default(1),
    RETRIES: Joi.number().integer().positive().empty('').default(0),
    HEADLESS: Joi.boolean().empty('').default(true),
    SLOWMO: Joi.number().integer().positive().empty('').default(0),
    VIEWPORT_HEIGHT: Joi.number().integer().positive().empty('').default(null),
    VIEWPORT_WIDTH: Joi.number().integer().positive().empty('').default(null),

    // Application variables
    APPLICATION: Joi.string().required(),
    APPLICATION_ENVIRONMENT: Joi.string().empty('').valid('local', 'dev', 'qa', 'stg', 'uat', 'prd'),

    // Logger variables
    LOG_CONSOLE: Joi.boolean().empty('').default(false),
    LOG_TYPE: Joi.string().empty('').valid('text', 'json').default('text'),
    LOG_LEVEL: Joi.string().empty('').valid('info', 'debug', 'warn', 'error', 'trace').default('info'),
    LOG_TIMESTAMP_FORMAT: Joi.string().empty('').default('YYYY-MM-DD HH:mm:ss'),
    LOG_LINE_LENGTH: Joi.number().integer().positive().empty('').default(100),

    // Miscellanea
    JIRA_BOARD: Joi.string().allow(''),
    ALLURE_REPORT_REMOVE_STATUS: Joi.string().allow('')
        .custom((value: string, helpers) => {
            const statuses = value.split(',').map((item: string) => item.trim());

            for (const status of statuses) {
                const { error } = Joi.string().valid(...VALID_ALLURE_STATUSES).validate(status);
                if (error) {
                    return helpers.error('any.invalid', {
                        message: `'VALID_ALLURE_STATUSES' contém o valor inválido: '${status}'.`
                    });
                }
            }
            return statuses;
        })
}

const parsed = Joi.object(variables)
    .unknown(true)
    .validate(
        process.env, {
        allowUnknown: true,
        abortEarly: false,
    });

if (parsed.error) {
    throw new Error(`Environment variables validation error: ${parsed.error.message}`);
}

type Viewport = {
    height: number,
    width: number
}

export class Environment {

    static readonly WORKERS: number = parsed.value.WORKERS;
    static readonly RETRIES: number = parsed.value.RETRIES;
    static readonly HEADLESS: boolean = parsed.value.HEADLESS;
    static readonly SLOWMO: number = parsed.value.SLOWMO ?? 0;
    static readonly VIEWPORT: Viewport | null = parsed.value.VIEWPORT_HEIGHT && parsed.value.VIEWPORT_WIDTH
        ? {
            height: parsed.value.VIEWPORT_HEIGHT,
            width: parsed.value.VIEWPORT_WIDTH
        }
        : null;

    static readonly APPLICATION: string = parsed.value.APPLICATION;
    static readonly APPLICATION_ENVIRONMENT: string = parsed.value.APPLICATION_ENVIRONMENT;
    static readonly BASE_URL: string = 'https://automationexercise.com';
    static readonly BASE_API_URL: string = `${Environment.BASE_URL}/api`;
    static readonly CREATE_ACCOUNT_API_URL: string = `${Environment.BASE_API_URL}/createAccount`;
    static readonly DELETE_ACCOUNT_API_URL: string = `${Environment.BASE_API_URL}/deleteAccount`;
    static readonly PRODUCT_LIST_API_URL: string = `${Environment.BASE_API_URL}/productsList`;

    static readonly LOG_CONSOLE: boolean = parsed.value.LOG_CONSOLE;
    static readonly LOG_TYPE: string = parsed.value.LOG_TYPE;
    static readonly LOG_LEVEL: string = parsed.value.LOG_LEVEL;
    static readonly LOG_TIMESTAMP_FORMAT: string = parsed.value.LOG_TIMESTAMP_FORMAT;
    static readonly LOG_LINE_LENGTH: number = parsed.value.LOG_LINE_LENGTH;

    static readonly JIRA_BOARD: string = parsed.value.JIRA_BOARD;
    static readonly PROJECT_TAG: string = `@${Environment.JIRA_BOARD}`;
    static readonly SET_JIRA_TAG: Function = (id: number): string => { return `${Environment.PROJECT_TAG}-${id}` };

    static readonly ALLURE_REPORT_REMOVE_STATUS: string[] = parsed.value.ALLURE_REPORT_REMOVE_STATUS;
}