import { Page } from '@playwright/test'

export const login = async ({ page }: { page: Page }) => {
    await page.getByLabel('Email').fill('dhaval.javia@broadlume.com')
    await page.getByLabel('Password').fill('Abcd@1234')
    await page.getByTestId('submit').click()
}

export const getToast = async ({
    page,
    title,
    description,
}: {
    page: Page
    title: string
    description: string
}) => {
    const toastdiv = page.locator('li[data-radix-collection-item]')
    await toastdiv.filter({ has: page.getByText(title) }).waitFor()
    await toastdiv.filter({ has: page.getByText(description) }).waitFor()
}

export const waitForAllImagesToLoad = async ({ page }) => {
    await page.waitForFunction(imagesHaveLoaded)
}

function imagesHaveLoaded() {
    return Array.from(document.images).every((i) => i.complete)
}
