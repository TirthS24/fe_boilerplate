import { test, expect } from "./baseFixture";
import { getToast, login } from "./utils";

test.describe.parallel("Place Order", () => {
  test.beforeEach(async ({ context }) => {
    // Block any css requests for each test in this file.
    await context.route("**/api/create_order**", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ ERROR: "Order Complete" }),
      })
    );
  });

  // Form submission with valid required fields triggers order creation
  test("should create order when form is submitted with valid required fields", async ({
    page,
  }) => {
    await page.goto("/sales/place-order");
    await login({ page });

    await page.getByRole("button", { name: "+ Place Order" }).click();
    await page.waitForURL("/sales/place-order");
    const shipToDropDown = page.locator(
      'button[aria-placeholder="Select Ship To"]'
    );
    await expect(shipToDropDown).toBeDisabled();
    // Await api call here
    const dropDownApis = Promise.all([
      page.waitForResponse("**/api/get_customer**"),
      page.waitForResponse("**/api/get_pordfile**"),
    ]);
    await dropDownApis;
    await expect(shipToDropDown).toBeEnabled();
    await page.waitForTimeout(5000);
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
      "empty_inputs.png",
    ]);
    await shipToDropDown.click();
    await page
      .getByLabel("MANDALAY - MANDALAY BAY (3950 S LAS VEGAS BLVD)")
      .click();
    await page
      .locator("button")
      .filter({ hasText: "Select unit type" })
      .click();
    await page.getByLabel("HUNTER").click();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
      "filled_inputs.png",
    ]);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByRole("button", { name: "Search" })).toBeDisabled();
    const apis = Promise.all([
      page.waitForResponse("**/api/get_labor**"),
      page.waitForResponse("**/api/get_material**"),
    ]);
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
      "fetching_details.png",
    ]);

    await apis;
    await expect(page.getByRole("button", { name: "Search" })).toBeEnabled();

    await expect(
      page.getByRole("heading", { name: "Order Header" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Items in Order" })
    ).toBeVisible();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
      "filling_details.png",
    ]);

    await page.getByLabel("Ordered By*").fill("Test Case");
    await page.getByLabel("Email *").fill("dhaval.javia@broadlume.com");
    await page.getByLabel("P.O. Number*").fill("PO1234");

    const button = page.locator('label:has-text("Occupied") + button');
    await button.filter({ hasText: "Select an option" }).click();
    await page.getByLabel("Vacant").click();

    const calendarBtn = page.locator(
      'label:has-text("Requested Install Date") + button'
    );
    await calendarBtn.click();

    await page.getByLabel("Go to next month").click();
    await page.getByLabel("Go to next month").click();
    await page.getByLabel("Go to next month").click();
    await page.getByRole("gridcell", { name: "10" }).click();
    await page.getByText("Items in Order").click();
    await page.getByTestId("checkbox-2___1").click();
    await expect(page.getByTestId("checkbox-2___1")).toBeChecked();
    await expect(page.getByTestId("checkbox-2")).toHaveAttribute(
      "data-state",
      "indeterminate"
    );
    await expect(page.getByTestId("checkbox-CARPET")).toHaveAttribute(
      "data-state",
      "indeterminate"
    );

    await page.getByTestId("checkbox-5").click();
    await expect(page.getByTestId("checkbox-5")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-VINYL")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5___1")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5___2")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5___3")).toHaveAttribute(
      "data-state",
      "checked"
    );

    await expect(page.getByTestId("checkbox-5___4")).toHaveAttribute(
      "data-state",
      "checked"
    );

    const submitBtn = page.getByRole("button", { name: "Submit" });
    await expect(submitBtn).toBeDisabled();
    await page.getByLabel("Unit Number*").fill("123");
    await expect(submitBtn).toBeEnabled();
    expect(await page.screenshot({ fullPage: true })).toMatchSnapshot([
      "submitting_details.png",
    ]);
    await submitBtn.click();
    await getToast({
      page,
      title: "Order",
      description: "Order Complete",
    });
  });

  test("should reset form to original values", async ({ page }) => {
    await page.goto("/sales/place-order");
    await login({ page });

    await page.getByRole("button", { name: "+ Place Order" }).click();
    await page.waitForURL("/sales/place-order");
    const shipToDropDown = page.locator(
      'button[aria-placeholder="Select Ship To"]'
    );
    await expect(shipToDropDown).toBeDisabled();
    // Await api call here
    const dropDownApis = Promise.all([
      page.waitForResponse("**/api/get_customer**"),
      page.waitForResponse("**/api/get_pordfile**"),
    ]);
    await dropDownApis;
    await expect(shipToDropDown).toBeEnabled();
    // expect(await page.screenshot({fullPage: true})).toMatchSnapshot(['empty_inputs.png'])
    await shipToDropDown.click();
    await page
      .getByLabel("MANDALAY - MANDALAY BAY (3950 S LAS VEGAS BLVD)")
      .click();
    await page
      .locator("button")
      .filter({ hasText: "Select unit type" })
      .click();
    await page.getByLabel("HUNTER").click();
    await page.waitForTimeout(5000);
    // expect(await page.screenshot({fullPage: true})).toMatchSnapshot(['filled_inputs.png'])
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByRole("button", { name: "Search" })).toBeDisabled();

    await Promise.all([
      page.waitForResponse("**/api/get_labor**"),
      page.waitForResponse("**/api/get_material**"),
    ]);

    await expect(page.getByRole("button", { name: "Search" })).toBeEnabled();

    await expect(
      page.getByRole("heading", { name: "Order Header" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Items in Order" })
    ).toBeVisible();

    await page.getByLabel("Ordered By*").fill("Test Case");
    await page.getByLabel("Email *").fill("dhaval.javia@broadlume.com");
    await page.getByLabel("P.O. Number*").fill("PO1234");

    const button = page.locator('label:has-text("Occupied") + button');
    await button.filter({ hasText: "Select an option" }).click();
    await page.getByLabel("Vacant").click();

    const calendarBtn = page.locator(
      'label:has-text("Requested Install Date") + button'
    );
    await calendarBtn.click();

    await page.getByLabel("Go to next month").click();
    await page.getByLabel("Go to next month").click();
    await page.getByLabel("Go to next month").click();
    await page.getByRole("gridcell", { name: "10" }).click();
    await page.getByText("Items in Order").click();
    await page.getByTestId("checkbox-2___1").click();
    await expect(page.getByTestId("checkbox-2___1")).toBeChecked();
    await expect(page.getByTestId("checkbox-2")).toHaveAttribute(
      "data-state",
      "indeterminate"
    );
    await expect(page.getByTestId("checkbox-CARPET")).toHaveAttribute(
      "data-state",
      "indeterminate"
    );

    await page.getByTestId("checkbox-5").click();
    await expect(page.getByTestId("checkbox-5")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-VINYL")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5___1")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5___2")).toHaveAttribute(
      "data-state",
      "checked"
    );
    await expect(page.getByTestId("checkbox-5___3")).toHaveAttribute(
      "data-state",
      "checked"
    );

    await expect(page.getByTestId("checkbox-5___4")).toHaveAttribute(
      "data-state",
      "checked"
    );

    const submitBtn = page.getByRole("button", { name: "Submit" });
    const cancelBtn = page.getByRole("button", { name: "Cancel" });
    await expect(submitBtn).toBeDisabled();
    await page.getByLabel("Unit Number*").fill("123");
    await expect(submitBtn).toBeEnabled();
    await cancelBtn.click();
    // Check if form is reset or not.
    await expect(page.getByLabel("Unit Number*")).toBeEmpty();
    await expect(page.getByTestId("checkbox-2___1")).toBeChecked({
      checked: false,
    });
    await expect(page.getByTestId("checkbox-2")).toHaveAttribute(
      "data-state",
      "unchecked"
    );
    await expect(page.getByTestId("checkbox-CARPET")).toHaveAttribute(
      "data-state",
      "unchecked"
    );

    await expect(page.getByTestId("checkbox-5")).toHaveAttribute(
      "data-state",
      "unchecked"
    );
    await expect(page.getByTestId("checkbox-VINYL")).toHaveAttribute(
      "data-state",
      "unchecked"
    );
    await expect(page.getByTestId("checkbox-5")).toHaveAttribute(
      "data-state",
      "unchecked"
    );
    await expect(page.getByTestId("checkbox-5___1")).toHaveAttribute(
      "data-state",
      "unchecked"
    );
    await expect(page.getByTestId("checkbox-5___2")).toHaveAttribute(
      "data-state",
      "unchecked"
    );
    await expect(page.getByTestId("checkbox-5___3")).toHaveAttribute(
      "data-state",
      "unchecked"
    );

    await expect(page.getByTestId("checkbox-5___4")).toHaveAttribute(
      "data-state",
      "unchecked"
    );
  });
});
