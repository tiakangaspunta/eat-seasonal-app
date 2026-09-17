/**
 * The smoke flows: proof that the app is wired together, not a second copy of
 * the unit tests. Season arithmetic is Vitest's job, in lib/season/.
 *
 * Every assertion is on content or on a role, never on a CSS class, a pixel
 * position, or a sentence of prose. Editorial copy gets reworded, and a test
 * that fails because a sentence improved is a test people learn to ignore.
 * That is not hypothetical here: the placeholder this file replaced spent four
 * commits failing, looking for a heading removed in issue 007.
 */
import { expect, test } from '@playwright/test'

import { currentMonthName, importedOnlyCount, ingredientWithRecipes } from './fixtures'

/** Every ingredient card is a button that opens the panel, and says so. */
const cards = (page: import('@playwright/test').Page) => page.locator('button[aria-expanded]')

test('the home page opens on the current month, with produce on it', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText(currentMonthName())

  const { name } = ingredientWithRecipes()
  await expect(cards(page).filter({ hasText: name }).first()).toBeVisible()
  expect(await cards(page).count()).toBeGreaterThan(0)
})

test('clicking an ingredient opens its panel, listing the recipes that use it', async ({
  page,
}) => {
  const { name, recipeTitle } = ingredientWithRecipes()
  await page.goto('/')

  await cards(page).filter({ hasText: name }).first().click()

  const panel = page.getByRole('dialog', { name: `${name} details` })
  await expect(panel).toBeVisible()
  await expect(panel.getByText(recipeTitle)).toBeVisible()

  // The grid stays usable behind the panel: it is a panel, not a modal.
  await expect(cards(page).first()).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(panel).not.toBeVisible()
})

test('including imported produce adds ingredients to the page', async ({ page }) => {
  await page.goto('/')

  const domesticOnly = await cards(page).count()

  await page.getByRole('checkbox', { name: /imported/i }).check()
  const withImported = await cards(page).count()

  expect(withImported).toBe(domesticOnly + importedOnlyCount())
  expect(withImported).toBeGreaterThan(domesticOnly)
})
