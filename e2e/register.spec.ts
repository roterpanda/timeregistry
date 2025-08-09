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

  await registerUser(page, testUser, "http://localhost:3000/register");

});

test("Login user", async ({ page }) => {
  const testUser = generateTestUser();
  createdUsers.push(testUser.email);
  await registerUser(page, testUser, "http://localhost:3000/register");
  await page.goto("http://localhost:3000/login");
  await page.fill("input[name=email]", testUser.email);
  await page.fill("input[name=password]", testUser.password);
  await page.click("button[type=submit]", { timeout: 2000 });
  await page.waitForURL("http://localhost:3000/dashboard", { timeout: 5000 });
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
})