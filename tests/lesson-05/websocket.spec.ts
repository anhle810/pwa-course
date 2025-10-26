import { test, expect } from '@playwright/test';

test('Test WebSocket - Echo Server', async ({ page }) => {

    // Step 1: Go to the Websocket page and verify the connection
    await test.step('Step 1 - Connect WebSocket', async () => {
        await page.goto("https://echo.websocket.org/.ws");

        page.on('websocket', ws => {
            ws.on('framereceived', data => {
                console.log('Data received:', data.payload);
                expect.poll(() => {
                    return data.payload;
                }).toEqual("connected"); // Chờ payload = "connected"
            });
        });
        await expect(page.locator("div.info", { hasText: "connected" })).toBeVisible();
    });

    // Step 2: Send and receive message
    await test.step('Step 2 - Send and receive message', async () => {
        const message = 'Hello from PWA102';

        await page.locator("//textarea[@id='content']").fill(message);
        await page.click("//button[@id='send']");

        page.on('websocket', ws => {
            ws.on('framereceived', data => {
                console.log('Data received:', data.payload);
                expect.poll(() => {
                    return data.payload;
                }).toEqual(message); // Chờ payload = "Hello from PWA102"
            });
        });

        await expect(page.locator("div.send", { hasText: message })).toBeVisible();
        await expect(page.locator("div.recv", { hasText: message })).toBeVisible();
    });

    // Step 3: Disconnect and verify
    await test.step('Step 3 - Disconnect', async () => {
        await page.getByRole('button', { name: 'Disconnect from Server' }).click();


        page.on('websocket', ws => {
            ws.on('framereceived', data => {
                console.log('Data received:', data.payload);
                expect.poll(() => {
                    return data.payload;
                }).toEqual("disconnected"); // Chờ payload = "disconnected"
            });
        });

        await expect(page.locator("div.info", { hasText: "disconnected" })).toBeVisible();
    });
});