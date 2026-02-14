import {expect, test} from "@playwright/test";
import {execSync} from "node:child_process";
import {loginUser, registerUser} from "./helpers/testHelpers";
import {generateTestUser} from "./helpers/testData";

test.use({ viewport: { width: 393, height: 851 } }); // Mobile viewport

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
});

async function createProject(page: import("@playwright/test").Page, projectName: string, projectCode: string) {
  await page.request.get("http://localhost:8000/sanctum/csrf-cookie");

  // Open sidebar (mobile sheet) and navigate to create project
  await page.locator('button[data-slot="sidebar-trigger"]').click();
  await page.getByRole("link", { name: "Projects" }).click();
  await expect(page.getByRole("heading", { name: "All projects" })).toBeVisible();

  await page.getByRole("link", { name: "Create new project" }).click();
  await expect(page.getByRole("heading", { name: "Add a new project" })).toBeVisible();

  await page.getByPlaceholder("Project name").fill(projectName);
  await page.getByPlaceholder("Description").fill("Test project for time registration");
  await page.getByPlaceholder("Project code").fill(projectCode);
  await page.getByRole("button", { name: "Create Project" }).click();

  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
}

test.describe("Time Registration Mobile", () => {

  test("Add, edit, and delete time registration on mobile", async ({ page }) => {
    const testUser = generateTestUser();
    createdUsers.push(testUser.email);
    await registerUser(page, testUser, "/register");
    await loginUser(page, testUser, "/login");

    // Create a project first (required for time registration)
    const projectCode = Math.random().toString(36).substring(2, 7);
    const projectName = `TestProject ${projectCode}`;
    await createProject(page, projectName, projectCode);

    // Navigate to time registrations via sidebar
    await page.locator('button[data-slot="sidebar-trigger"]').click();
    await page.getByRole("link", { name: "Time registrations" }).click();
    await expect(page.getByRole("heading", { name: "All Time Registrations" })).toBeVisible();

    // --- ADD ---
    await page.getByRole("button", { name: "New Time Registration" }).click();

    // Bottom sheet should appear
    const sheet = page.locator('[data-slot="sheet-content"]');
    await expect(sheet).toBeVisible({ timeout: 5000 });
    await expect(sheet.getByText("New Time Registration")).toBeVisible();

    // Fill in the form
    await sheet.locator('#mobile-date').fill("2025-06-15");
    await sheet.locator('#mobile-duration').fill("4");

    // Select project
    await sheet.getByRole("combobox").click();
    await page.getByRole("option", { name: projectName }).click();

    await sheet.locator('#mobile-kilometers').fill("25");
    await sheet.locator('#mobile-notes').fill("Mobile test entry");

    // Submit
    await sheet.getByRole("button", { name: "Add" }).click();

    // Sheet should close and card should appear
    await expect(sheet).not.toBeVisible({ timeout: 5000 });

    // Verify the card is in the list
    await expect(page.getByText(projectName)).toBeVisible();
    await expect(page.getByText("4.00h")).toBeVisible();
    await expect(page.getByText("25.00")).toBeVisible();
    await expect(page.getByText("Mobile test entry")).toBeVisible();

    // --- EDIT ---
    // Click the edit button on the card
    const card = page.locator('[data-slot="card"]').filter({ hasText: projectName });
    await card.getByRole("button").filter({ has: page.locator('svg.lucide-pen') }).click();

    // Sheet should appear with edit title
    await expect(sheet).toBeVisible({ timeout: 5000 });
    await expect(sheet.getByText("Edit Time Registration")).toBeVisible();

    // Change duration and notes
    await sheet.locator('#mobile-duration').fill("6");
    await sheet.locator('#mobile-notes').fill("Updated mobile entry");

    await sheet.getByRole("button", { name: "Save" }).click();
    await expect(sheet).not.toBeVisible({ timeout: 5000 });

    // Verify updated values
    await expect(page.getByText("6.00h")).toBeVisible();
    await expect(page.getByText("Updated mobile entry")).toBeVisible();

    // --- DELETE ---
    const updatedCard = page.locator('[data-slot="card"]').filter({ hasText: projectName });
    await updatedCard.getByRole("button").filter({ has: page.locator('svg.lucide-trash') }).click();

    // Confirm delete (check icon appears)
    await updatedCard.getByRole("button").filter({ has: page.locator('svg.lucide-check') }).click();

    // Card should be gone
    await expect(page.getByText("Updated mobile entry")).not.toBeVisible({ timeout: 5000 });
  });
});
