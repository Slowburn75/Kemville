import { test, expect } from "@playwright/test";
test("doctor demo reviews intake, updates outcomes and validates availability", async ({
  page,
}) => {
  const calls: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/")) calls.push(r.url());
  });
  await page.goto("/demo/doctor");
  await page
    .getByRole("textbox", { name: "Search appointments" })
    .fill("Taylor");
  await page.getByRole("button", { name: /Taylor Reed/ }).click();
  await page.getByText("Review sample intake · 12 answers").click();
  await expect(
    page.getByText("Routine wellbeing discussion — fictional.", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "Private note draft · demo only" })
    .fill("Fictional demonstration note.");
  await page.getByRole("button", { name: "Save demo note" }).click();
  await expect(page.getByRole("status")).toContainText("No medical record");
  await page.getByRole("button", { name: "Mark completed" }).click();
  await expect(
    page.getByRole("button", { name: "Mark completed" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Availability", exact: true }).click();
  await page.getByLabel("Start time").fill("17:00");
  await page.getByRole("button", { name: "Save demo availability" }).click();
  await expect(page.getByRole("status")).toContainText(
    "End time must be later",
  );
  await page.getByLabel("End time").fill("18:00");
  await page.getByRole("button", { name: "Save demo availability" }).click();
  await expect(page.getByRole("status")).toContainText("No live slots");
  expect(calls).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    page.getByRole("textbox", { name: "Search appointments" }),
  ).toHaveValue("");
});
test("admin demo controls prices and payment exceptions without clinical records", async ({
  page,
}) => {
  const calls: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/")) calls.push(r.url());
  });
  await page.goto("/demo/admin");
  await expect(
    page.getByText(
      "Medical intake and clinical notes are not included in this workspace.",
      { exact: false },
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Services & pricing", exact: true })
    .click();
  await page.getByRole("button", { name: "Disable demo promotion" }).click();
  await expect(
    page.getByRole("button", { name: "Enable demo promotion" }),
  ).toBeVisible();
  const card = page
    .locator(".admin-service-list article")
    .filter({
      has: page.getByRole("heading", { name: "WhatsApp chat", exact: true }),
    });
  await card.getByLabel("Regular price (NGN)").fill("12000");
  await card.getByRole("button", { name: "Save demo price" }).click();
  await expect(card.getByText("Sample patient price: ₦12,000")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Clinic required" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Payments", exact: true }).click();
  await page.getByRole("button", { name: "Review late payment" }).click();
  await expect(page.getByRole("status")).toContainText(
    "No appointment confirmed",
  );
  const payment = page
    .locator(".admin-payment-list article")
    .filter({ has: page.getByRole("heading", { name: "DEMO-PAY-303" }) });
  await payment.getByRole("button", { name: "Queue demo refund" }).click();
  await expect(page.getByRole("status")).toContainText("No actual refund");
  await page
    .getByRole("button", { name: "Notifications", exact: true })
    .click();
  await page.getByRole("button", { name: "Simulate retry" }).click();
  await expect(page.getByRole("status")).toContainText("No message sent");
  await page
    .getByRole("button", { name: "Audit records", exact: true })
    .click();
  await expect(
    page.getByText("Demo launch promotion disabled.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Private note draft · demo only" }),
  ).toHaveCount(0);
  expect(calls).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page
    .getByRole("button", { name: "Services & pricing", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Disable demo promotion" }),
  ).toBeVisible();
});
