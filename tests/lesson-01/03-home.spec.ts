import { test, expect } from '@playwright/test';

function getBaseUrl(): string {
    const env = process.env.ENV;
    let url = process.env.BASE_URL_DEV || 'https://e-commerce-dev.betterbytesvn.com/';
    if (env === 'prod') {
        url = process.env.BASE_URL_DEV
            || 'https://e-commerce.betterbytesvn.com/';
    }
    return url;
}
let homePageTitle = "//h1[@class='vw-page-title']"
test.describe("HOME_001", () => {
    test("Navigate to E-commerce page and click Home button", async ({ page }) => {
        await page.goto(getBaseUrl());
        await page.getByRole('link', { name: 'HOME' }).click();
        await expect(page.locator(homePageTitle)).toHaveText("Sample Page");
    });
});