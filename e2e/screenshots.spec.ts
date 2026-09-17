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
import { test } from '@playwright/test'

import { ingredientWithRecipes } from './fixtures'

const OUT = 'docs/screenshots'

test.describe('screenshots', () => {
  test('home view', async ({ page }, testInfo) => {
    await page.goto('/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    await page.screenshot({ path: `${OUT}/home-${testInfo.project.name}.png`, fullPage: false })
  })

  test('ingredient panel open', async ({ page }, testInfo) => {
    const { name } = ingredientWithRecipes()
    await page.goto('/')
    await page.locator('button[aria-expanded]').filter({ hasText: name }).first().click()
    await page.getByRole('dialog', { name: `${name} details` }).waitFor()
    await page.screenshot({ path: `${OUT}/panel-${testInfo.project.name}.png`, fullPage: false })
  })
})
