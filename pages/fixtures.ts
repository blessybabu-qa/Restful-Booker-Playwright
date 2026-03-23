import { test as base } from '@playwright/test';
import { POManager } from './POManager';

type MyFixtures = {
    pom: POManager;
};

export const test = base.extend<MyFixtures>({
    pom: async ({ page }, use) => {
        const pom = new POManager(page);
        await page.setViewportSize({ width: 1920, height: 1080 });
        await pom.navigate();
        await page.evaluate(() => {
            window.localStorage.clear();
            window.sessionStorage.clear();
        });
        await page.reload({ waitUntil: 'networkidle' });
        await use(pom);
        await page.close();
    },
});

export { expect } from '@playwright/test';