import { test, expect } from "@playwright/test";

const TARGET_USER = process.env.TARGET_USERNAME || "nan006";
const TARGET_ROLE = process.env.TARGET_ROLE || "user-pro";

if (!["user-free", "user-pro"].includes(TARGET_ROLE)) {
  throw new Error('TARGET_ROLE must be either "user-free" or "user-pro".');
}

async function openTestUserDetails(page) {
  if (!page.url().includes("/admin/users") || page.url().match(/\/admin\/users\/.+/)) {
    await page.goto("/admin/users", { waitUntil: "domcontentloaded" });
  }
  await page.getByPlaceholder("ค้นหาจากชื่อ หรืออีเมล...").fill(TARGET_USER);

  const matchingRow = page
    .getByRole("row")
    .filter({ hasText: TARGET_USER });

  await expect(matchingRow).toHaveCount(1);
  await matchingRow.getByRole("link", { name: "ดูรายละเอียด" }).click();
  await expect(
    page.getByRole("heading", { name: TARGET_USER }),
  ).toBeVisible();
}


test.describe("Admin Dashboard - US-15", () => {
  test.beforeEach(async ({ page }) => {
    page.on("request", (request) => {
      console.log("REQUEST:", request.method(), request.url());
    });
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", {name: "แผงควบคุมผู้ดูแลระบบ",}), ).toBeVisible();

  });

  // TC-ADM-001
  test("TC-ADM-001: แสดงข้อมูลสรุปของ Admin Dashboard", async ({ page }) => {
    await expect(page.getByRole("heading", {name: "แผงควบคุมผู้ดูแลระบบ",}),).toBeVisible();
    await expect(page.getByText("ผู้ใช้งานทั้งหมด")).toBeVisible();
    await expect(page.getByText("ผู้ใช้งานระดับ Pro")).toBeVisible();
    await expect(page.getByText("ผู้ใช้ธรรมดา")).toBeVisible();
    await expect(page.getByText("ผู้ใช้งานที่ถูกระงับ")).toBeVisible();
    await expect(page.getByText("การเรียกใช้ AI (วันนี้)")).toBeVisible();
    await expect(page.locator("p").filter({hasText: "โทเค็นที่ใช้ไปวันนี้",}).first(),).toBeVisible();
    await expect(page.getByText("อัตราข้อผิดพลาด (Error Rate)")).toBeVisible();
    await expect(page.getByText("เวลาตอบสนองเฉลี่ย")).toBeVisible();
  });

  // TC-ADM-002
  test("TC-ADM-002: แสดงกราฟและข้อมูลสถิติย้อนหลัง 7 วัน", async ({ page }) => {
    await expect(page.getByRole("heading", {name: "ปริมาณการใช้โทเค็น (7 วันย้อนหลัง)",}),).toBeVisible();
    await expect(page.getByText("จำนวนโทเค็นที่ถูกใช้งานในแต่ละวัน"),).toBeVisible();
    await expect(page.getByRole("heading", {name: "จำนวนการตรวจสอบคำผิด (7 วันย้อนหลัง)",}),).toBeVisible();
    await expect(page.getByText("จำนวนครั้งที่เรียกใช้งาน AI ในแต่ละวัน"),).toBeVisible();
    
  const charts = page.getByRole("application");
    await expect(charts).toHaveCount(2);
    await expect(charts.nth(0)).toBeVisible();
    await expect(charts.nth(1)).toBeVisible();
  });

  // TC-ADM-003
  test("TC-ADM-003: แสดงข้อมูลผู้ใช้งานล่าสุดบน Dashboard", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", {name: "แผงควบคุมผู้ดูแลระบบ", }), ).toBeVisible();
    await expect(page.getByRole("heading", {name: "รายชื่อผู้ใช้งานล่าสุด",}),).toBeVisible();
    await expect(page.getByText("ผู้ใช้งานที่เพิ่งสมัครหรือมีความเคลื่อนไหวล่าสุด"),).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("columnheader", {name: "ชื่อผู้ใช้"}),).toBeVisible();
    await expect(page.getByRole("columnheader", {name: "ระดับสมาชิก",}),).toBeVisible();
    await expect(page.getByRole("columnheader", {name: "โทเค็นที่ใช้ไปวันนี้",}),).toBeVisible();
    await expect(page.getByRole("columnheader", {name: "วันที่ใช้งานล่าสุด",}),).toBeVisible();
});

  // TC-ADM-004
  test("TC-ADM-004: ระบบสามารถแสดงหน้า Dashboard ได้เมื่อโหลดข้อมูล", async ({
    page,
  }) => {
    await expect(page.getByRole("heading", {name: "แผงควบคุมผู้ดูแลระบบ",}),).toBeVisible();
    await expect(page.getByText("ผู้ใช้งานทั้งหมด")).toBeVisible();
    await expect(page.getByText("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่"),).not.toBeVisible();
  });
});

// TC-ADM-005
test("TC-ADM-005: กรณีระบบไม่สามารถโหลดข้อมูล Dashboard ได้", async ({
  page,
}) => {
  await page.route("**/api/dashboard/admin/overview", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    });
  });
  let alertMessage = "";
  page.on("dialog", async (dialog) => {
    alertMessage = dialog.message();
    console.log("ALERT:", alertMessage);
    await dialog.accept();
  });
  await page.goto("/admin");
  await expect(page.getByRole("heading", {name: "แผงควบคุมผู้ดูแลระบบ",}),).toBeVisible();
  await expect(page.getByText("ผู้ใช้งานทั้งหมด")).toBeVisible();
  await expect(page.getByText("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่"),
  ).not.toBeVisible();
  expect(alertMessage).toBe("");
});

test.describe("Admin User Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/admin/users", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("heading", { name: "จัดการผู้ใช้งาน" }),
    ).toBeVisible();
  });

  test("TC-ADM-USR-001: ค้นหาผู้ใช้จากชื่อ", async ({ page }) => {
    await page.getByPlaceholder("ค้นหาจากชื่อ หรืออีเมล...").fill(TARGET_USER);

    const matchingRow = page
      .getByRole("row")
      .filter({ hasText: TARGET_USER });

    await expect(matchingRow).toHaveCount(1);
    await expect(matchingRow).toContainText(TARGET_USER);
  });

  test("TC-ADM-USR-002: กรองรายชื่อผู้ใช้ตามสิทธิ์ Pro", async ({ page }) => {
    await page.locator("select").nth(0).selectOption("user-pro");

    const usersTable = page.locator("tbody");
    await expect(usersTable).toContainText("user-pro");
    await expect(usersTable).not.toContainText("user-free");
  });

  test("TC-ADM-USR-003: เปิดดูรายละเอียดผู้ใช้", async ({ page }) => {
    await page.getByPlaceholder("ค้นหาจากชื่อ หรืออีเมล...").fill(TARGET_USER);

    const matchingRow = page
      .getByRole("row")
      .filter({ hasText: TARGET_USER });

    await expect(matchingRow).toHaveCount(1);
    await matchingRow.getByRole("link", { name: "ดูรายละเอียด" }).click();

    await expect(page).toHaveURL(/\/admin\/users\/[^/]+$/);
    await expect(
      page.getByRole("heading", { name: TARGET_USER }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "สิทธิ์การใช้งาน" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "เขตอันตราย (ลบบัญชี)" }),
    ).toBeVisible();
  });

  test("TC-ADM-USR-004: กำหนดสิทธิ์การใช้งานจริงตาม TARGET_ROLE", async ({
    page,
  }) => {
    await openTestUserDetails(page);

    const roleSelect = page.locator("select");
    const currentRole = await roleSelect.inputValue();

    if (currentRole !== TARGET_ROLE) {
      await roleSelect.selectOption(TARGET_ROLE);

      const updateResponsePromise = page.waitForResponse(
        (res) =>
          res.url().includes("/api/dashboard/admin/users/") &&
          res.request().method() === "PATCH",
      );
      await page.getByRole("button", { name: "บันทึก" }).click();
      const response = await updateResponsePromise;
      expect(
        response.ok(),
        `Role update failed (${response.status()}): ${await response.text()}`,
      ).toBeTruthy();

      await expect(page.getByText("อัปเดตข้อมูลผู้ใช้สำเร็จ")).toBeVisible();
    }

    // Confirm the role is persisted by fetching the user again from the server.
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: TARGET_USER })).toBeVisible();
    await expect(page.locator("select")).toHaveValue(TARGET_ROLE);

    await page.goto("/admin/users", { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("ค้นหาจากชื่อ หรืออีเมล...").fill(TARGET_USER);
    const matchingRow = page
      .getByRole("row")
      .filter({ hasText: TARGET_USER });
    await expect(matchingRow).toHaveCount(1);
    await expect(matchingRow).toContainText(TARGET_ROLE);
  });

  test("TC-ADM-USR-005: ระงับบัญชีผู้ใช้งานด้วยข้อมูลจริง", async ({
    page,
  }) => {
    await openTestUserDetails(page);

    const banCheckbox = page.locator('div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]').first();
    const isCurrentlyBanned = await banCheckbox.isChecked();

    // หากยังไม่ถูกระงับ ให้ทำการระงับบัญชี
    if (!isCurrentlyBanned) {
      await banCheckbox.check();

      const updateResponsePromise = page.waitForResponse(
        (res) =>
          res.url().includes("/api/dashboard/admin/users/") &&
          res.request().method() === "PATCH" &&
          res.status() === 200,
      );
      await page.getByRole("button", { name: "บันทึก" }).click();
      const response = await updateResponsePromise;
      expect(response.status()).toBe(200);

      await expect(page.getByText("อัปเดตข้อมูลผู้ใช้สำเร็จ")).toBeVisible();
    }

    await expect(banCheckbox).toBeChecked();

    // ไปหน้ารายการผู้ใช้งานเพื่อตรวจสอบว่าสถานะเปลี่ยนเป็น "ถูกระงับ (Banned)" จริง
    await page.goto("/admin/users", { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("ค้นหาจากชื่อ หรืออีเมล...").fill(TARGET_USER);
    const matchingRow = page
      .getByRole("row")
      .filter({ hasText: TARGET_USER });
    await expect(matchingRow).toHaveCount(1);
    await expect(matchingRow).toContainText("ถูกระงับ (Banned)");
  });

  test("TC-ADM-USR-006: ยกเลิกระงับบัญชีผู้ใช้งานด้วยข้อมูลจริง", async ({
    page,
  }) => {
    await openTestUserDetails(page);

    const banCheckbox = page.locator('div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]').first();
    const isCurrentlyBanned = await banCheckbox.isChecked();

    // หากถูกระงับอยู่ ให้ทำการยกเลิกระงับบัญชี (ปลดแบน)
    if (isCurrentlyBanned) {
      await banCheckbox.uncheck();

      const updateResponsePromise = page.waitForResponse(
        (res) =>
          res.url().includes("/api/dashboard/admin/users/") &&
          res.request().method() === "PATCH" &&
          res.status() === 200,
      );
      await page.getByRole("button", { name: "บันทึก" }).click();
      const response = await updateResponsePromise;
      expect(response.status()).toBe(200);

      await expect(page.getByText("อัปเดตข้อมูลผู้ใช้สำเร็จ")).toBeVisible();
    }

    await expect(banCheckbox).not.toBeChecked();

    // ไปหน้ารายการผู้ใช้งานเพื่อตรวจสอบว่าสถานะกลับเป็น "ปกติ" จริง
    await page.goto("/admin/users", { waitUntil: "domcontentloaded" });
    await page.getByPlaceholder("ค้นหาจากชื่อ หรืออีเมล...").fill(TARGET_USER);
    const matchingRow = page
      .getByRole("row")
      .filter({ hasText: TARGET_USER });
    await expect(matchingRow).toHaveCount(1);
    await expect(matchingRow).toContainText("ปกติ");
  });

  test("TC-ADM-USR-007: ตรวจสอบหน้าต่างยืนยันการลบบัญชีและกดยกเลิก", async ({
    page,
  }) => {
    await openTestUserDetails(page);

    await page.getByRole("button", { name: "ลบผู้ใช้งานนี้ถาวร" }).click();
    const confirmationDialog = page.getByRole("dialog");
    await expect(confirmationDialog).toBeVisible();
    await expect(confirmationDialog).toContainText("ไม่สามารถย้อนกลับได้");

    // กดยกเลิกเพื่อไม่ให้ลบข้อมูลจริง
    await confirmationDialog.getByRole("button", { name: "ยกเลิก" }).click();
    await expect(confirmationDialog).not.toBeVisible();
    await expect(page.getByRole("heading", { name: TARGET_USER })).toBeVisible();
  });
});
