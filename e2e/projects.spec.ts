import {expect, test} from "@playwright/test";
import {execSync} from "node:child_process";
import {loginUser, registerUser} from "./helpers/testHelpers";
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
});

test.describe("Projects", () => {

  test("Create project, project listed on dashboard, search project", async ({ page }) => {
    const testUser = generateTestUser();
    createdUsers.push(testUser.email);
    await registerUser(page, testUser, "/register");
    await loginUser(page, testUser, "/login");

    await page.getByRole("link", { name: "Create new project" }).click();

    await expect(page.getByRole('heading', { name: 'Add a new project' })).toBeVisible();

    const projectName = page.getByPlaceholder("Project name");
    await expect(projectName).toBeVisible({ timeout: 5000 });
    await expect(projectName).toBeEnabled();
    await projectName.click();
    await projectName.fill("Test project 123");

    const projectDesc = page.getByPlaceholder("Description");
    await expect(projectDesc).toBeVisible({ timeout: 5000 });
    await expect(projectDesc).toBeEnabled();
    await projectDesc.click();
    await projectDesc.fill("Test project description");

    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Test project 123')).toBeVisible();

    await page.goto('/dashboard/project/list');
    await expect(page.getByRole('heading', { name: 'Your projects' })).toBeVisible();
    await expect(page.getByText('Test project 123')).toBeVisible();

    const searchProject = page.getByPlaceholder("Search projects...");
    await expect(searchProject).toBeVisible({ timeout: 5000 });
    await expect(searchProject).toBeEnabled();
    await searchProject.click();
    await searchProject.fill("awa");
    await expect(page.getByText('Test project 123')).not.toBeVisible();


  });
});