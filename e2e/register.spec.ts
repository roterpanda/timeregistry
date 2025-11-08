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

test("Register user and redirect to verify email page", async ({ page }) => {
  const testUser = generateTestUser();
  createdUsers.push(testUser.email);

  await registerUser(page, testUser, "/register", false);

  // Assert we're on verify-email page
  await expect(page).toHaveURL(/\/verify-email$/);
  await expect(page.getByText(/verify your email/i)).toBeVisible();
});

test("Login verified user and show dashboard", async ({ page }) => {
  const testUser = generateTestUser();
  createdUsers.push(testUser.email);

  // Register and auto-verify
  await registerUser(page, testUser, "/register", true);

  // Login
  await loginUser(page, testUser, "/login");

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test("Prevent unverified user from accessing dashboard", async ({ page }) => {
  const testUser = generateTestUser();
  createdUsers.push(testUser.email);

  // Register without verification
  await registerUser(page, testUser, "/register", false);

  // Try to login
  await loginUser(page, testUser, "/login");

  // Should redirect back to verify-email or show error
  await expect(page).toHaveURL(/\/verify-email$/);
});