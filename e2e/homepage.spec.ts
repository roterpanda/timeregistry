import {expect, test} from "@playwright/test";


test('Homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/TimeRegistry/);
})