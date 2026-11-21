import { test, expect } from "@playwright/test";
test("mobile consultation exploration is honest and accessible", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Care, with you",
  );
  await page.getByRole("link", { name: "Find your consultation" }).click();
  await expect(page.getByRole("status")).toContainText("not open for booking");
  await page.getByRole("button", { name: /Voice consultation/ }).click();
  await expect(
    page.getByRole("button", { name: /Voice consultation/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: /In-person consultation/ }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test('unconfigured authentication fails closed',async({request})=>{const response=await request.post('/api/auth/login',{data:{email:'patient@example.test',password:'test-password'}});expect([403,503]).toContain(response.status());});
