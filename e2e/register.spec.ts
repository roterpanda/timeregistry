import {expect, test} from "@playwright/test";
import {execSync} from "node:child_process";
import {generateTestUser} from "./helpers/testData";
import {loginUser, registerUser} from "./helpers/testHelpers";

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

test("Login user and show dashboard", async ({ page }) => {
  const testUser = generateTestUser();
  createdUsers.push(testUser.email);

  await registerUser(page, testUser, "/register");
  await loginUser(page, testUser, "/login");

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
})