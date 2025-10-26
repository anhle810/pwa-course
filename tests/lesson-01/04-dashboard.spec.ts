import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

function getBaseUrl(): string {
    const env = process.env.ENV;
    let url = process.env.BASE_URL_DEV || 'https://e-commerce-dev.betterbytesvn.com/';
    if (env === 'prod') {
        url = process.env.BASE_URL_PROD || 'https://e-commerce.betterbytesvn.com/';
    }
    return url;
}

function getUsername(): string {
    const env = process.env.ENV;
    let username = process.env.USER_NAME_DEV || '';
    if (env === 'prod') {
        username = process.env.USER_NAME_PROD || '';
    }
    return username;
}

function getPassword(): string {
    const env = process.env.ENV;
    let password = process.env.PASSWORD_DEV || '';
    if (env === 'prod') {
        password = process.env.PASSWORD_PROD || '';
    }
    return password;
}

let dashboardPageTitle = "//div[@class='wp-menu-name' and text()='Dashboard']"
test.describe("DASHBOARD", () => {
    test("DASHBOARD_AUTH_001 - Login success", async ({ page }) => {
        await test.step("Navigate to E-commerce page", async () => {
            await page.goto(getBaseUrl())
        });
        await test.step("Navigate to Home page", async () => {
            await page.getByRole('link', { name: 'HOME' }).click();
        });
        await test.step("Navigate to Dashboard page", async () => {
            await page.getByRole('link', { name: 'your dashboard' }).click();
        });
        await test.step("Fill valid username and password", async () => {
            await page.getByRole('textbox', { name: 'Username or Email Address' }).fill(getUsername());
            await page.getByRole('textbox', { name: 'Password' }).fill(getPassword());
            await page.getByRole('button', { name: 'Log In' }).click();
            await expect(page.locator(dashboardPageTitle)).toBeVisible({ timeout: 5000 });
        });
    });

    test("DASHBOARD_AUTH_002 - Login fail", async ({ page }) => {
        await test.step("Navigate to E-commerce page", async () => {
            await page.goto(getBaseUrl())
        });
        await test.step("Navigate to Home page", async () => {
            await page.getByRole('link', { name: 'HOME' }).click();
        });
        await test.step("Navigate to Dashboard page", async () => {
            await page.getByRole('link', { name: 'your dashboard' }).click();
        });
        await test.step("Fill valid username and password", async () => {
            await page.getByRole('textbox', { name: 'Username or Email Address' }).fill("invalid_user");
            await page.getByRole('textbox', { name: 'Password' }).fill("invalid_password");
            await page.getByRole('button', { name: 'Log In' }).click();
            await expect(page.locator(dashboardPageTitle)).not.toBeVisible({ timeout: 5000 });
        });
    });
});