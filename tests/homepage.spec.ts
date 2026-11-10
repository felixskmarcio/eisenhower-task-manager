import { expect, test } from '@playwright/test';

const homepage = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : 'http://127.0.0.1:5000';

test.use({ reducedMotion: 'reduce' });

test('homepage renders with readable primary action and honest contact status', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(homepage);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('main')).toHaveCSS('background-color', 'rgb(9, 9, 11)');
  await expect(page.locator('header .container')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(page.locator('nav')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const login = page.locator('nav a[href="/login"]');
  await expect(login).toHaveCSS('color', 'rgb(9, 9, 11)');
  await expect(login).toHaveCSS('background-color', 'rgb(204, 255, 0)');
  await expect(page.locator('main a button, main button a, main a[href="#"]')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Envio indisponível' })).toBeDisabled();
  expect(errors).toEqual([]);
});

test('section navigation leaves headings below the fixed header', async ({ page }) => {
  await page.goto(homepage);
  await page.locator('nav').getByRole('link', { name: 'Recursos', exact: true }).click();
  await expect.poll(async () => page.locator('#features').evaluate(el =>
    Math.round(el.getBoundingClientRect().top)
  )).toBeGreaterThanOrEqual(64);
  await expect(page.locator('#features')).toBeInViewport();
});

test('mobile menu navigates, closes and keeps the homepage within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(homepage);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const toggle = page.getByTestId('button-mobile-menu');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.locator('header').getByRole('link', { name: 'Contato', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#contact')).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
