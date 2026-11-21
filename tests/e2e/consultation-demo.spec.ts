import { test, expect, type Page } from "@playwright/test";
async function reachReview(page: Page, service = "Video consultation") {
  await page.goto("/demo/consultation");
  await page
    .getByRole("checkbox", {
      name: "I understand this is a demonstration using fictional information.",
    })
    .check();
  await page.getByRole("button", { name: "Continue to consultation" }).click();
  await page.getByRole("button", { name: new RegExp(service) }).click();
  await expect(
    page.getByRole("button", { name: /In-person consultation/ }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Choose a time" }).click();
  await expect(page.getByRole("button", { name: /11:30/ })).toBeDisabled();
  await page.getByRole("button", { name: "14:00", exact: true }).click();
  await page.getByRole("button", { name: "Continue to intake" }).click();
  await page
    .getByRole("textbox", { name: "05 · What is your main health concern?" })
    .fill("Fictional routine wellbeing discussion.");
  await page.getByRole("button", { name: "Review consultation" }).click();
}
async function completePayment(page: Page) {
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Preview payment" }).click();
  await page
    .getByRole("button", { name: "Simulate successful payment" })
    .click();
  await expect(
    page.getByRole("heading", { name: "You’re all set." }),
  ).toBeVisible();
}
test("video demo preserves intake, retries failed payment and supports clinician outcome", async ({
  page,
}) => {
  const calls: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/")) calls.push(r.url());
  });
  await reachReview(page);
  await expect(
    page.getByRole("button", { name: "Preview payment" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("textbox", {
      name: "05 · What is your main health concern?",
    }),
  ).toHaveValue("Fictional routine wellbeing discussion.");
  await page.getByRole("button", { name: "Review consultation" }).click();
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Preview payment" }).click();
  await page.getByRole("button", { name: "Simulate failure" }).click();
  await expect(page.getByRole("status")).toContainText("sample payment failed");
  await page.getByRole("button", { name: "Retry demo payment" }).click();
  await expect(page.getByText("DEMO-KMV-2048", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Meet link preview only — no meeting created"),
  ).toBeVisible();
  await page.getByRole("button", { name: "View demo dashboard" }).click();
  await page.getByRole("button", { name: "Doctor view" }).click();
  await expect(
    page.getByText("Fictional routine wellbeing discussion.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Mark completed" }).click();
  await expect(
    page.getByText("Completed · demo", { exact: true }),
  ).toBeVisible();
  expect(calls).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "First, a little about you." }),
  ).toBeVisible();
  await expect(page.getByRole("checkbox")).not.toBeChecked();
});
test("voice demo can be rescheduled and cancelled without real operations", async ({
  page,
}) => {
  await reachReview(page, "Voice consultation");
  await completePayment(page);
  await expect(
    page.getByText("Call instructions only — no call placed"),
  ).toBeVisible();
  await page.getByRole("button", { name: "View demo dashboard" }).click();
  await page
    .getByRole("button", { name: "Reschedule demo", exact: true })
    .click();
  await page.getByRole("button", { name: "15:30", exact: true }).click();
  await page.getByRole("button", { name: "Save demo schedule" }).click();
  await expect(page.getByRole("status")).toContainText("rescheduled");
  await page.getByRole("button", { name: "Cancel demo appointment" }).click();
  await expect(
    page.getByText("Cancelled · demo", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("No real refund");
});
test("WhatsApp demo shows reference-only handoff with no external chat link", async ({
  page,
}) => {
  await reachReview(page, "WhatsApp chat");
  await completePayment(page);
  await expect(
    page.getByText("Chat preview only — no message sent"),
  ).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
});
