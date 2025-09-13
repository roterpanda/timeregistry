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
    const randomProjectCode = Math.random().toString(36).substring(2, 7);

    const testUser = generateTestUser();
    createdUsers.push(testUser.email);
    await registerUser(page, testUser, "/register");
    await loginUser(page, testUser, "/login");

    await page.getByRole("link", { name: "Create new project" }).click();

    await page.request.get("http://localhost:8000/sanctum/csrf-cookie");

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

    const projectCode = page.getByPlaceholder("Project code");
    await expect(projectCode).toBeVisible({ timeout: 5000 });
    await expect(projectCode).toBeEnabled();
    await projectCode.click();
    await projectCode.fill(randomProjectCode);

    await page.getByRole("button", { name: "Create Project" }).click();

    await expect(page.getByText('Test project 123')).toBeVisible();

    await page.request.get("http://localhost:8000/sanctum/csrf-cookie");

    await page.locator('button[data-slot="sidebar-trigger"]').click();
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page.getByRole('heading', { name: 'All projects' })).toBeVisible();
    await expect(page.getByText('Test project 123')).toBeVisible();

    const searchProject = page.getByPlaceholder("Search projects...");
    await expect(searchProject).toBeVisible({ timeout: 5000 });
    await expect(searchProject).toBeEnabled();
    await searchProject.click();
    await searchProject.fill("jksjsfhjskhur");
    await expect(page.getByText('Test project 123')).not.toBeVisible();


  });
});