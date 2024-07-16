import { test, expect } from '@playwright/test';

test(`theme is persisted and used after page refresh`, async ({ page }) => {
  const themeButtonSelector = `button[title="Change theme"]`;

  await page.goto(`/`);

  await expect(page.locator(`button[title="Sign in"]`)).toBeEnabled();

  await expect(page.locator(`body.light`)).toBeDefined();

  const beforeThemeChange = await page.screenshot({
    path: `before-theme-change.png`,
  });

  await page.click(themeButtonSelector);

  await expect(page.locator(`body.dark`)).toBeDefined();

  const afterThemeChange = await page.screenshot({
    path: `after-theme-change.png`,
  });

  await page.click(themeButtonSelector);

  await expect(page.locator(`body.light`)).toBeDefined();

  await page.reload();

  expect(beforeThemeChange).toMatchSnapshot(`before-theme-change.png`);
  expect(afterThemeChange).toMatchSnapshot(`after-theme-change.png`);
});

// test(`creator and theme are persisted in storage after page refresh`, async ({
//   page,
// }) => {
//   await page.goto('/');

//   await expect(page.locator('body.light')).toBeDefined();

//   await expect(page.locator('button:text("Sign in")')).toBeEnabled();

//   await page.click('button:text("Change theme")');

//   await expect(page.locator('body.dark')).toBeDefined();

//   await page.click('button:text("Change theme")');

//   await expect(page.locator('body.light')).toBeDefined();
// });

// await page.goto('home');

// // And I see not disabled button 'Sign in'
// const signInButton = page.locator('button:text("Sign in")');
// await expect(signInButton).not.toBeDisabled();

// // When I click button 'Change theme'
// await page.click('button:text("Change theme")');

// // And I type in creator '## Markdown local storage sync test'
// await page.fill('#creator', '## Markdown local storage sync test');

// // Then I see text '## Markdown local storage sync test' and 'Markdown local storage sync test'
// await expect(page).toHaveText('## Markdown local storage sync test');
// await expect(page).toHaveText('Markdown local storage sync test');

// // When I reload page
// await page.reload();

// // Then I see text '## Markdown local storage sync test' and 'Markdown local storage sync test'
// await expect(page).toHaveText('## Markdown local storage sync test');
// await expect(page).toHaveText('Markdown local storage sync test');
