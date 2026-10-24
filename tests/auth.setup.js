import { test as setup } from "@playwright/test";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const authFile = "playwright/.auth/admin.json";

setup("Login as Admin", async ({ browser, page }) => {
  setup.setTimeout(120000);

  const baseUrl =
    process.env.PLAYWRIGHT_BASE_URL || "https://t-check-two.vercel.app";

  if (existsSync(authFile)) {
    const validationContext = await browser.newContext({
      storageState: authFile,
    });
    const validationPage = await validationContext.newPage();
    let sessionIsValid = false;

    try {
      await validationPage.goto(`${baseUrl}/admin/users`, {
        waitUntil: "domcontentloaded",
      });
      await validationPage
        .getByRole("heading", { name: "จัดการผู้ใช้งาน" })
        .waitFor({ state: "visible", timeout: 8000 });
      sessionIsValid = true;
    } catch {
      console.log("Saved admin session expired. Sign in again to refresh it.");
    } finally {
      await validationContext.close();
    }

    if (sessionIsValid) {
      console.log("Found a valid admin session, skipping login.");
      return;
    }
  }

  await page.goto(`${baseUrl}/sign-in`, { waitUntil: "domcontentloaded" });

  const identity = process.env.ADMIN_IDENTITY || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin1234";

  console.log(`Signing in as admin (${identity})...`);
  await page.locator("#login-identity").fill(identity);
  await page.locator("#login-password").fill(password);

  const signInResponsePromise = page
    .waitForResponse(
      (res) =>
        res.url().includes("/api/user/signin") ||
        res.url().includes("/signin"),
      { timeout: 30000 },
    )
    .catch(() => null);

  await page.locator("#login-submit").click();
  const signInRes = await signInResponsePromise;
  if (signInRes) {
    console.log("Sign in response status:", signInRes.status());
  }

  // หากมี SweetAlert แสดงขึ้นมา ให้กดยืนยัน
  const swalConfirm = page.locator(".swal2-confirm");
  try {
    await swalConfirm.waitFor({ state: "visible", timeout: 5000 });
    await swalConfirm.click();
  } catch {
    // ไม่มี swal หรือปิดอัตโนมัติ
  }

  // เข้าสู่หน้าแผงควบคุมผู้ดูแลระบบ
  await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
  await page
    .getByRole("heading", { name: "แผงควบคุมผู้ดูแลระบบ" })
    .waitFor({ state: "visible", timeout: 30000 });

  mkdirSync(dirname(authFile), { recursive: true });
  await page.context().storageState({
    path: authFile,
  });

  console.log("Admin login successful. Session saved to", authFile);
});