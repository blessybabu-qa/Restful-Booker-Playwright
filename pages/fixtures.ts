import { test as base } from '@playwright/test';
import { POManager } from './POManager';

type MyFixtures = {
    pom: POManager;
};

export const test = base.extend<MyFixtures>({
    pom: async ({ page }, use) => {
        const pom = new POManager(page);
        await pom.homePage.maximizeWindow()
        await pom.navigate(); // This is your "beforeEach" navigation
        await use(pom);
    },
});

export { expect } from '@playwright/test';