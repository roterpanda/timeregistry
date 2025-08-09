import {expect, test} from "@playwright/test";
import {execSync} from "node:child_process";
import {generateTestUser} from "./helpers/testData";
import {registerUser} from "./helpers/registerHelper";

const createdUsers: string[] = [];

test.afterEach(() => {
  createdUsers.forEach(email => {
    try {
      execSync(`cd backend && php artisan test:cleanup-users ${email}`, { stdio: "inherit" });
    } catch (error) {
      console.error("Error cleaning up user:", error);
    }
  });
  createdUsers.length = 0;
})

test("Register user", async ({ page }) => {
  const testUser = generateTestUser();
  createdUsers.push(testUser.email);

  await registerUser(page, testUser, "/register");

});

test("Login user", async ({ page }) => {
  const testUser = generateTestUser();
  createdUsers.push(testUser.email);
  await registerUser(page, testUser, "/register");
  await page.goto("/login");
  const emailInput = page.locator('input[name="email"]');
  await expect(emailInput).toBeVisible({ timeout: 5000 });
  await emailInput.click();
  await emailInput.fill(testUser.email);

  const passwordInput = page.locator('input[name="password"]');
  await expect(passwordInput).toBeVisible({ timeout: 5000 });
  await passwordInput.click();
  await passwordInput.fill(testUser.password);
  await page.click("button[type=submit]");
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
})