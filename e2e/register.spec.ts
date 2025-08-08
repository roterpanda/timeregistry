import {expect, test} from "@playwright/test";
import {execSync} from "node:child_process";
import {generateTestUser} from "./helpers/testData";

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

  await page.goto("http://localhost:3000/register");
  const username = page.getByPlaceholder("Username");
  await username.scrollIntoViewIfNeeded();
  await username.focus();
  await expect(username).toBeVisible();
  await username.fill(testUser.username);
  const email = page.getByPlaceholder("Email");
  await email.scrollIntoViewIfNeeded();
  await email.focus();
  await expect(email).toBeVisible();
  await email.fill(testUser.email);
  const password = page.getByPlaceholder("Password", {exact: true});
  await password.scrollIntoViewIfNeeded();
  await password.focus();
  const confirmPassword = page.getByPlaceholder("Confirm Password", {exact: true});
  await expect(password).toBeVisible();
  await password.focus();
  await password.fill(testUser.password);
  await confirmPassword.focus();
  await expect(confirmPassword).toBeVisible();
  await confirmPassword.fill(testUser.password);
  const submit = page.getByText("Submit");
  await submit.click();
  await expect(page.getByText("User registered successfully")).toBeVisible({ timeout: 10000 });
});