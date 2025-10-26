import { test, expect } from '@playwright/test'

test.describe('E-commerce Authentication Testing', () => {
    test.beforeAll(async () => {
        console.log('beforeAll');
    });

    test.beforeEach(async () => {
        console.log('beforeEach');
    });

    test.afterEach(async () => {
        console.log('afterEach');
    });

    test.afterAll(async () => {
        console.log('afterAll');
    });

    // Failed test #1
    test('first test: Guest views product', async ({ page }) => {
        console.log('first test: Check product list');
        expect(1).toBe(2); // Fail intentionally
    });

    // Passed test #1
    test('second test: Admin maages product', async ({ page }) => {
        console.log('second test: Check admin dashboard');
        expect(true).toBeTruthy();
    });

    // Passed test #2
    test('third test: User login successfully', async () => {
        console.log('third test: Successful login flow');
        expect("login").toContain("log");
    });

    // Failed test #2
    test('fourth test: Cart checkout with invalid card', async () => {
        console.log('fourth test: Invalid payment flow');
        expect("success").toBe("fail");
    });

    // Passed test #3
    test('fifth test: User logout successfully', async () => {
        console.log('fifth test: Logout test');
        expect(2 + 2).toBe(4);
    });

    // ⏰ Timeout test #1
    test('sixth test: Long-running order process', async ({ }, testInfo) => {
        testInfo.setTimeout(5000);
        console.log('sixth test: Simulating timeout...');
        await new Promise(resolve => setTimeout(resolve, 7000));
    });
});