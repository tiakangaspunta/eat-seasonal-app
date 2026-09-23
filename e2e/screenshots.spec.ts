/**
 * The visual record: the home view and the open panel, at both viewports.
 *
 * These assert nothing. They are here so a layout change can be reviewed by
 * looking, and so step 7's mobile pass has a before to compare against. They
 * write into docs/screenshots/, named by project, so a rerun overwrites rather
 * than accumulates.
 *
 * Run them with `npm run screenshots`.
 */
import { type Page, test } from '@playwright/test'

import { ingredientWithRecipes } from './fixtures'

const OUT = 'docs/screenshots'

/**
 * Waits for the card photos actually on screen. They are `loading="lazy"`, so
 * a heading being visible says nothing about them, and a screenshot taken then
 * shows grey squares where the photos go.
 */
async function photosOnScreen(page: Page) {
  await page.waitForFunction(() =>
    [...document.images]
      .filter((img) => {
        const box = img.getBoundingClientRect()
        return box.bottom > 0 && box.top < window.innerHeight
      })
      .every((img) => img.complete && img.naturalWidth > 0),
  )
}

test.describe('screenshots', () => {
  test('home view', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await photosOnScreen(page)
    await page.screenshot({ path: `${OUT}/home-${testInfo.project.name}.png`, fullPage: false })
  })

  test('ingredient panel open', async ({ page }, testInfo) => {
    const { name } = ingredientWithRecipes()
    await page.goto('/')
    await page.locator('button[aria-expanded]').filter({ hasText: name }).first().click()
    await page.getByRole('dialog', { name: `${name} details` }).waitFor()
    await photosOnScreen(page)
    await page.screenshot({ path: `${OUT}/panel-${testInfo.project.name}.png`, fullPage: false })
  })
})
