import {expect, test} from "@playwright/test";
import {execSync} from "node:child_process";

test.beforeAll(() => {
  execSync("cd backend && php artisan test:cleanup-users", { stdio: "inherit"});
})

test.afterEach(() => {
  execSync("cd backend && php artisan test:cleanup-users", { stdio: "inherit"});
})

test("Register user", async ({ page }) => {
  await page.goto("http://localhost:3000/register");
  const username = page.getByPlaceholder("Username");
  await expect(username).toBeVisible();
  await username.fill("testuser");
  const email = page.getByPlaceholder("Email");
  await expect(email).toBeVisible();
  await email.fill("test@example.com");
  const password = page.getByPlaceholder("Password", {exact: true});
  const confirmPassword = page.getByPlaceholder("Confirm Password", {exact: true});
  await expect(password).toBeVisible();
  await expect(confirmPassword).toBeVisible();
  await password.fill("testpw67890");
  await confirmPassword.fill("testpw67890");
  const submit = page.getByText("Submit");
  await submit.click();
  await expect(page.getByText("User registered successfully")).toBeVisible({ timeout: 10000 });
});