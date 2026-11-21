import { test, expect } from "@playwright/test";
test("new services and procurement draft work on mobile", async ({ page }) => {
  await page.goto("/equipment");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Medical equipment",
  );
  await page
    .getByRole("button", { name: "Add Ultrasound systems", exact: true })
    .click();
  await expect(page.getByText("1 category selected")).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download list" }).click();
  expect((await download).suggestedFilename()).toBe(
    "kemville-purchase-enquiry.txt",
  );
  await page.goto("/medical-tourism");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Medical tourism",
  );
  await expect(
    page.getByText("Coronary artery disease", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Infertility", { exact: true })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("booking content has mobile gutters", async ({ page }) => {
  await page.goto("/book");
  const bounds = await page.getByRole("heading", { level: 1 }).boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(24);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(
    page.viewportSize()!.width - 24,
  );
});
