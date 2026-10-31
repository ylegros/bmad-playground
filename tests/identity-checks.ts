import { expect, type Page } from '@playwright/test';

export async function checkConstructorIdentity(page: Page, mode: 'local' | 'bundled') {
  const forbidden: string[] = [];
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.origin !== `http://127.0.0.1:${mode === 'local' ? 3001 : 3103}` ||
        (mode === 'bundled' && url.pathname.startsWith('/api/'))) {
      forbidden.push(url.href);
      return route.abort();
    }
    return route.continue();
  });
  await page.goto('/?season=2021&view=standings&category=constructors');
  const identities = page.locator('.constructor-identity');
  await expect(identities.first()).toBeVisible();
  // Warm both seasons so switching back retains the existing keyed table rows.
  const season = page.getByRole('combobox', { name: 'Season', exact: true });
  await season.selectOption('2010');
  await expect(page.getByRole('table')).toContainText('Lotus');
  await season.selectOption('2021');
  const loaded = identities.filter({ hasText: /^Ferrari$/ });
  await loaded.evaluate(element => { element.setAttribute('data-retained-identity', 'yes'); });
  const name = (await loaded.locator(':scope > span').last().innerText()).trim();
  const image = loaded.locator('img');
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(image).toHaveAttribute('alt', '');
  await image.evaluate(img => img.dispatchEvent(new Event('error')));
  const failed = identities.filter({ hasText: name });
  await expect(failed).toHaveText(name);
  await expect(failed.locator('.constructor-frame')).toHaveCount(0);
  expect(await failed.ariaSnapshot()).toContain(name);

  // Ferrari reuses the same logo file; the retained identity must reset failure by season.
  await season.selectOption('2010');
  const recovered = identities.filter({ hasText: /^Ferrari$/ });
  await expect(recovered).toHaveAttribute('data-retained-identity', 'yes');
  await expect.poll(() => recovered.locator('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);

  // Abort every logo request to exercise real load failures across shared surfaces.
  await page.route(/\/media\/[^/]+\.(?:png|jpe?g|svg|webp)(?:\?.*)?$/, route => route.abort());
  for (const view of ['standings', 'progress', 'compare']) {
    await page.goto(`/?season=2021&view=${view}&category=constructors&a=hamilton&b=max_verstappen`);
    if (view === 'progress') {
      await expect(page.getByRole('group', { name: 'Constructors to plot' })).toBeVisible();
      await expect(page.getByRole('checkbox', { name: 'Mercedes', exact: true })).toBeVisible();
      await expect(page.locator('.constructor-frame')).toHaveCount(0);
      continue;
    }
    await expect(identities.first()).toBeVisible();
    await expect(page.locator('.constructor-frame')).toHaveCount(0);
    for (const identity of await identities.all()) {
      const label = (await identity.innerText()).trim();
      expect(label.length).toBeGreaterThan(0);
      await expect(identity.locator(':scope > span')).toHaveCount(1);
      expect((await identity.ariaSnapshot()).split(label).length - 1).toBe(1);
    }
  }
  for (const [layout, width, zoom] of [['desktop', 1280, 1], ['narrow', 390, 1], ['zoom', 1280, 2]] as const) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(value => { document.documentElement.style.zoom = String(value); }, zoom);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.screenshot({ path: `.site-artifacts/iteration-three/identity-${mode}-${layout}.png`, fullPage: true });
  }
  await expect(page.locator('.portrait-frame[data-fallback="true"]').first()).toBeVisible();
  for (const [side, initials, name] of [['a', 'LH', 'Lewis Hamilton'], ['b', 'MV', 'Max Verstappen']]) {
    const driver = page.locator(`.summary-identity.driver-${side}`);
    await expect(driver.locator('.portrait-frame > span')).toHaveText(initials);
    await expect(driver.locator('.portrait-frame > span')).toHaveAttribute('aria-hidden', 'true');
    await expect(driver.locator('.driver-identity strong')).toHaveText(name);
  }
  expect(forbidden).toEqual([]);
}
