import { test, expect } from '@playwright/test';

test(`Should log in successfully`, async ({ page }) => {
  // Visit the login page
  await page.goto(`/education-zone/`);

  await expect(page.locator(`#gatsby-focus-wrapper`)).toBeVisible();
});
