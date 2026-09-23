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

test('the switch leads to the recipe view, where a recipe opens with a link to its method', async ({
  page,
}) => {
  const { recipeTitle } = ingredientWithRecipes()
  // Wait for the page to finish starting up before clicking the switch. On a
  // busy dev server a click that lands earlier is lost: 4 in 12 runs failed
  // that way, and all 12 passed with this wait.
  await page.goto('/', { waitUntil: 'networkidle' })

  await page.getByRole('navigation', { name: 'View' }).getByRole('link', { name: 'Recipes' }).click()
  await expect(page).toHaveURL(/\/recipes$/)

  await cards(page).filter({ hasText: recipeTitle }).first().click()

  const panel = page.getByRole('dialog', { name: `${recipeTitle} recipe` })
  await expect(panel).toBeVisible()
  // The method is never copied in, so the link out is the one thing it must have.
  await expect(panel.getByRole('link', { name: /open the method/i })).toHaveAttribute('target', '_blank')

  // The panel is in the address, so a reload keeps it open.
  await page.reload()
  await expect(panel).toBeVisible()
})

test('a recipe in an ingredient panel leads to that recipe, and its ingredient leads back', async ({
  page,
}) => {
  const { name, recipeTitle } = ingredientWithRecipes()
  await page.goto('/')

  await cards(page).filter({ hasText: name }).first().click()
  await page
    .getByRole('dialog', { name: `${name} details` })
    .getByRole('link', { name: recipeTitle })
    .click()

  const recipePanel = page.getByRole('dialog', { name: `${recipeTitle} recipe` })
  await expect(recipePanel).toBeVisible()
  await expect(page).toHaveURL(/\/recipes\?open=/)

  await recipePanel.getByRole('link', { name, exact: true }).first().click()
  await expect(page.getByRole('dialog', { name: `${name} details` })).toBeVisible()
  await expect(page).toHaveURL(/\/\?open=/)
})
