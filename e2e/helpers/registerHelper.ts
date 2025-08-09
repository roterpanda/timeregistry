import {expect, Page } from "@playwright/test";


export async function registerUser(page: Page, user: {username:string, password:string, email:string}, url: string ) {

  await page.request.get("http://localhost:8000/sanctum/csrf-cookie");

  await page.goto(url, { waitUntil: "domcontentloaded" });

  // Username
  const username = page.getByPlaceholder("Username");
  await expect(username).toBeVisible();
  await expect(username).toBeEnabled();
  await username.click();
  await username.fill(''); // ensure it's empty before typing
  await username.pressSequentially(user.username, { delay: 50 }); // slow typing prevents race
  await expect(username).toHaveValue(user.username);

  // Email
  const email = page.getByPlaceholder("Email");
  await expect(email).toBeVisible({ timeout: 5000 });
  await expect(email).toBeEnabled();
  await email.click();
  await email.fill(user.email);

  // Password
  const password = page.getByPlaceholder("Password", { exact: true });
  await expect(password).toBeVisible({ timeout: 5000 });
  await expect(password).toBeEnabled();
  await password.click();
  await password.fill(user.password);

  // Confirm Password
  const confirmPassword = page.getByPlaceholder("Confirm Password", { exact: true });
  await expect(confirmPassword).toBeVisible({ timeout: 5000 });
  await expect(confirmPassword).toBeEnabled();
  await confirmPassword.click();
  await confirmPassword.fill(user.password);

  const submit = page.getByRole("button", { name: "Submit" });
  await expect(submit).toBeVisible();
  await submit.scrollIntoViewIfNeeded();
  await submit.click();

  await expect(page.getByText("User registered successfully")).toBeVisible();
}