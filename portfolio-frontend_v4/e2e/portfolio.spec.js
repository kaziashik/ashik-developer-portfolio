import { expect, test } from '@playwright/test'

test.describe('Portfolio public flows', () => {
  test('home page loads hero content', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle('KaziAshik')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Hi, This is/i)
    await expect(page.getByRole('button', { name: 'View Resume' })).toBeVisible()
    await expect(page.locator('#home').getByRole('link', { name: 'Contact Me' })).toBeVisible()
  })

  test('main sections are present on the homepage', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('#home')).toBeVisible()
    await expect(page.locator('#about')).toBeVisible()
    await expect(page.locator('#experience')).toBeVisible()
    await expect(page.locator('#skills')).toBeVisible()
    await expect(page.locator('#projects')).toBeVisible()
  })

  test('navbar brand opens login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /kazi ashik/i }).first().click()
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible()
  })

  test('contact page is reachable from hero CTA', async ({ page }) => {
    await page.goto('/')
    await page.locator('#home').getByRole('link', { name: 'Contact Me' }).click()
    await expect(page).toHaveURL(/\/contact$/)
    await expect(page.getByRole('heading', { name: /let.?s talk/i })).toBeVisible()
  })

  test('projects section shows featured work cards', async ({ page }) => {
    await page.goto('/')
    await page.locator('#projects').evaluate((el) => el.scrollIntoView({ block: 'start' }))
    const projects = page.locator('#projects')
    await expect(projects.getByRole('heading', { name: /featured projects/i })).toBeVisible()
    await expect(projects.getByRole('link', { name: /view/i }).first()).toBeVisible()
  })

  test('theme toggle switches data-theme attribute', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    const before = await html.getAttribute('data-theme')
    await page.getByRole('button', { name: /toggle theme/i }).first().click()
    await expect(html).not.toHaveAttribute('data-theme', before)
    await page.getByRole('button', { name: /toggle theme/i }).first().click()
    await expect(html).toHaveAttribute('data-theme', before)
  })

  test('view resume opens the resume viewer modal', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const resumeBtn = page.locator('#home').getByRole('button', { name: 'View Resume' })
    await expect(resumeBtn).toBeVisible()
    await resumeBtn.click()
    await expect(page.getByRole('heading', { name: /ashik resume/i })).toBeVisible()
    await expect(page.getByText('Ashik_Resume.pdf')).toBeVisible()
    await expect(page.getByRole('button', { name: /download resume/i })).toBeVisible()
  })
})
