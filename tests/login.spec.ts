import { test, expect } from './baseFixture'
import { getToast, waitForAllImagesToLoad } from './utils'

test.describe.parallel('Testing Login Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/sales/login')
        await page.waitForURL('/sales/login')
    })
    // Check if form is submitted on initial values or not.
    test('Initial Values test', async ({ page }) => {
        // Recording...
        await waitForAllImagesToLoad({ page })
        await expect(
            page.locator('button[type="submit"]').getByText('Login')
        ).toBeDisabled()
        await page.waitForTimeout(2000)
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
            'initial.png',
        ])
    })
    // Check if form is submitted on invalid email or not.
    test('Invalid Email', async ({ page }) => {
        // Recording...

        await page.getByLabel('Email').fill('dhaval.javia@m')
        await page.getByText('Invalid Email address').click()
        // Field Cleanup
        await page.getByLabel('Email').clear()
        await expect(
            page.locator('button[type="submit"]').getByText('Login')
        ).toBeDisabled()
        await page.waitForTimeout(2000)
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
            'invalid_email.png',
        ])
    })
    // Check if form is submitted on invalid password or not.
    test('Invalid Password', async ({ page }) => {
        // Recording...

        await page.getByLabel('Password').fill('A')
        await page.getByText('Password too short!').click()
        await page.getByLabel('Password').clear()
        await expect(
            page.locator('button[type="submit"]').getByText('Login')
        ).toBeDisabled()
        await page.waitForTimeout(2000)
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
            'invalid_password.png',
        ])
    })

    // Clicking on "forgot password" redirects to forgot password page.
    test('Forgot Password Enter Redirect', async ({ page }) => {
        // Recording...

        await page.getByLabel('Password').press('Tab')
        await page.getByText('Forgot Password?').press('Enter')
        // sales/forgotpassword
        await page.waitForURL('/sales/forgotpassword')
    })

    // Clicking on forgot pwd correctly redirects to url.
    test('Forgot Password Click Redirect', async ({ page }) => {
        // Recording...

        await page.getByText('Forgot Password?').click()
        // sales/forgotpassword
        await page.waitForURL('/sales/forgotpassword')
    })

    // Check if combination of values enable the submit btn.
    test('Valid Inputs', async ({ page }) => {
        // Recording...

        await page.getByLabel('Email').fill('dhaval.javia@broadlume.com')
        await page.getByLabel('Password').fill('Abcd@1234')
        await expect(
            page.locator('button[type="submit"]').getByText('Login')
        ).toBeEnabled()
        await page.locator('button[type="submit"]').getByText('Login').click()
        await expect(
            page.locator('button[type="submit"]').getByText('Login')
        ).toBeDisabled()
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
            'valid_inputs.png',
        ])
        await getToast({
            page,
            title: 'Login Successful',
            description: 'Redirecting to Dashboard',
        })
    })

    // Incorrect email and password.
    test('Incorrect Inputs', async ({ page }) => {
        // Recording...

        await page.getByLabel('Email').fill('dhaval.javia1@broadlume.com')
        await page.getByLabel('Password').fill('Abcd@1234')
        await expect(
            page.locator('button[type="submit"]').getByText('Login')
        ).toBeEnabled()
        await page.locator('button[type="submit"]').getByText('Login').click()
        await expect(
            page.locator('button[type="submit"]').getByText('Login')
        ).toBeDisabled()
        expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
            'incorrect_inputs.png',
        ])
        const toastdiv = page.locator('li[data-radix-collection-item]')
        await toastdiv
            .filter({ has: page.getByText('Invalid Request') })
            .waitFor()
        await toastdiv
            .filter({ has: page.getByText('User does not exist') })
            .waitFor()
    })
})
