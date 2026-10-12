import { test, expect } from "@playwright/test";

test.describe("Admin Dashboard - US-15", () => {
  test.beforeEach(async ({ page }) => {
    page.on("request", (request) => {
      console.log("REQUEST:", request.method(), request.url());
    });

    // ใช้ Google Login Session ที่บันทึกไว้
    await page.goto("/admin", { waitUntil: "domcontentloaded" });

    // รอให้หน้า Admin โหลดสำเร็จ
    await expect(
      page.getByRole("heading", {
        name: "แผงควบคุมผู้ดูแลระบบ",
      }),
    ).toBeVisible();

  });

  // TC-ADM-001
  test("TC-ADM-001: แสดงข้อมูลสรุปของ Admin Dashboard", async ({ page }) => {
    // ตรวจสอบหัวข้อ Dashboard
    await expect(
      page.getByRole("heading", {
        name: "แผงควบคุมผู้ดูแลระบบ",
      }),
    ).toBeVisible();

    // ตรวจสอบจำนวนผู้ใช้งานทั้งหมด
    await expect(page.getByText("ผู้ใช้งานทั้งหมด")).toBeVisible();

    // ตรวจสอบผู้ใช้งานระดับ Pro
    await expect(page.getByText("ผู้ใช้งานระดับ Pro")).toBeVisible();

    // ตรวจสอบผู้ใช้ธรรมดา
    await expect(page.getByText("ผู้ใช้ธรรมดา")).toBeVisible();

    // ตรวจสอบผู้ใช้ที่ถูกระงับ
    await expect(page.getByText("ผู้ใช้งานที่ถูกระงับ")).toBeVisible();

    // ตรวจสอบการเรียกใช้ AI
    await expect(page.getByText("การเรียกใช้ AI (วันนี้)")).toBeVisible();

    // ตรวจสอบ Token ที่ใช้วันนี้
    // ใช้ paragraph เพื่อไม่ให้ชนกับหัวตารางที่มีข้อความเดียวกัน
    await expect(
      page
        .locator("p")
        .filter({
          hasText: "โทเค็นที่ใช้ไปวันนี้",
        })
        .first(),
    ).toBeVisible();

    // ตรวจสอบ Error Rate
    await expect(page.getByText("อัตราข้อผิดพลาด (Error Rate)")).toBeVisible();

    // ตรวจสอบ Average Response Time
    await expect(page.getByText("เวลาตอบสนองเฉลี่ย")).toBeVisible();
  });
  // TC-ADM-002
  test("TC-ADM-002: แสดงกราฟและข้อมูลสถิติย้อนหลัง 7 วัน", async ({ page }) => {
    // ตรวจสอบหัวข้อกราฟ Token
    await expect(
      page.getByRole("heading", {
        name: "ปริมาณการใช้โทเค็น (7 วันย้อนหลัง)",
      }),
    ).toBeVisible();

    // ตรวจสอบคำอธิบายกราฟ Token
    await expect(
      page.getByText("จำนวนโทเค็นที่ถูกใช้งานในแต่ละวัน"),
    ).toBeVisible();

    // ตรวจสอบหัวข้อกราฟตรวจคำผิด
    await expect(
      page.getByRole("heading", {
        name: "จำนวนการตรวจสอบคำผิด (7 วันย้อนหลัง)",
      }),
    ).toBeVisible();

    // ตรวจสอบคำอธิบายกราฟตรวจคำผิด
    await expect(
      page.getByText("จำนวนครั้งที่เรียกใช้งาน AI ในแต่ละวัน"),
    ).toBeVisible();

    // ตรวจสอบว่ามีกราฟ 2 กราฟ
    // หน้าเว็บใช้ role="application" กับกราฟ
    const charts = page.getByRole("application");

    await expect(charts).toHaveCount(2);

    // ตรวจสอบกราฟ Token
    await expect(charts.nth(0)).toBeVisible();

    // ตรวจสอบกราฟตรวจคำผิด
    await expect(charts.nth(1)).toBeVisible();
  });

  // TC-ADM-003
  test("TC-ADM-003: แสดงข้อมูลผู้ใช้งานล่าสุดบน Dashboard", async ({
    page,
  }) => {
    // ตรวจสอบหัวข้อ Dashboard
    await expect(
      page.getByRole("heading", {
        name: "แผงควบคุมผู้ดูแลระบบ",
      }),
    ).toBeVisible();

    // ตรวจสอบหัวข้อรายชื่อผู้ใช้งานล่าสุด
    await expect(
      page.getByRole("heading", {
        name: "รายชื่อผู้ใช้งานล่าสุด",
      }),
    ).toBeVisible();

    // ตรวจสอบคำอธิบาย
    await expect(
      page.getByText("ผู้ใช้งานที่เพิ่งสมัครหรือมีความเคลื่อนไหวล่าสุด"),
    ).toBeVisible();

    // ตรวจสอบตารางผู้ใช้งานล่าสุด
    await expect(page.getByRole("table")).toBeVisible();

    // ตรวจสอบหัวตาราง
    await expect(
      page.getByRole("columnheader", {
        name: "ชื่อผู้ใช้",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", {
        name: "ระดับสมาชิก",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", {
        name: "โทเค็นที่ใช้ไปวันนี้",
      }),
    ).toBeVisible();

    await expect(
      page.getByRole("columnheader", {
        name: "วันที่ใช้งานล่าสุด",
      }),
    ).toBeVisible();
  });

  // TC-ADM-004
  test("TC-ADM-004: ระบบสามารถแสดงหน้า Dashboard ได้เมื่อโหลดข้อมูล", async ({
    page,
  }) => {
    // ตรวจสอบ Dashboard
    await expect(
      page.getByRole("heading", {
        name: "แผงควบคุมผู้ดูแลระบบ",
      }),
    ).toBeVisible();

    // ตรวจสอบข้อมูลสำคัญ
    await expect(page.getByText("ผู้ใช้งานทั้งหมด")).toBeVisible();

    // ตรวจสอบว่าไม่แสดงข้อความ Error
    await expect(
      page.getByText("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่"),
    ).not.toBeVisible();
  });
});
// TC-ADM-005
test("TC-ADM-005: กรณีระบบไม่สามารถโหลดข้อมูล Dashboard ได้", async ({
  page,
}) => {
  // จำลอง API Dashboard ตอบกลับ HTTP 500
  await page.route("**/api/dashboard/admin/overview", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    });
  });

  // ดัก Browser Alert หากมี
  let alertMessage = "";
  page.on("dialog", async (dialog) => {
    alertMessage = dialog.message();
    console.log("ALERT:", alertMessage);
    await dialog.accept();
  });

  await page.goto("/admin");

  await expect(
    page.getByRole("heading", {
      name: "แผงควบคุมผู้ดูแลระบบ",
    }),
  ).toBeVisible();

  // ระบบควรยังแสดงหน้าจอ Dashboard ได้ โดยไม่แสดง alert error หรือข้อความแจ้งเตือนแบบนี้
  await expect(page.getByText("ผู้ใช้งานทั้งหมด")).toBeVisible();
  await expect(
    page.getByText("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่"),
  ).not.toBeVisible();
  expect(alertMessage).toBe("");
});
