import {expect, Page } from "@playwright/test";


export async function registerUser(page: Page, user: {username:string, password:string, email:string}, url: string ) {
  await page.goto(url);

  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);

  const username = page.getByPlaceholder("Username");
  await username.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await username.focus();
  await expect(username).toBeVisible();
  await username.fill(user.username);
  await page.waitForTimeout(800);
  const email = page.getByPlaceholder("Email");
  await email.scrollIntoViewIfNeeded();
  await email.focus();
  await expect(email).toBeVisible();
  await email.fill(user.email);
  const password = page.getByPlaceholder("Password", {exact: true});
  await password.scrollIntoViewIfNeeded();
  await password.focus();
  const confirmPassword = page.getByPlaceholder("Confirm Password", {exact: true});
  await expect(password).toBeVisible();
  await password.focus();
  await password.fill(user.password);
  await confirmPassword.focus();
  await expect(confirmPassword).toBeVisible();
  await confirmPassword.fill(user.password);
  const submit = page.getByRole("button", { name: "Submit" });
  await submit.scrollIntoViewIfNeeded();
  await submit.click({ timeout: 2000 });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await expect(page.getByText("User registered successfully")).toBeVisible({ timeout: 10000 });
}