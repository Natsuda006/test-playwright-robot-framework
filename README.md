# -test-playwright-robot-framework-

# ระบบตรวจสอบและแก้ไขคำผิดด้วย AI (T-Check)
## ชุดทดสอบอัตโนมัติ (Playwright & Robot Framework) และเอกสารกรณีทดสอบ (ส่วนผู้ดูแลระบบ)

[![Document Version](https://img.shields.io/badge/Document%20Version-v1.0.0-blue.svg)](#หมายเลขเวอร์ชันของเอกสารและโค้ด-versioning)
[![GitHub Release](https://img.shields.io/badge/GitHub%20Release-v1.0.0-green.svg)](#หมายเลขเวอร์ชันของเอกสารและโค้ด-versioning)
[![Playwright](https://img.shields.io/badge/Playwright-v1.55.0-orange.svg)](https://playwright.dev/)
[![Robot Framework](https://img.shields.io/badge/Robot%20Framework-v7.5-black.svg)](https://robotframework.org/)
[![Test Status](https://img.shields.io/badge/Tests-12%2F12%20Passed%20(100%25)-brightgreen.svg)](#สรุปผลการทดสอบ-test-cases-summary)
[![Progress Period](https://img.shields.io/badge/Progress-สิงหาคม--กันยายน%202569-purple.svg)](#รายงานความคืบหน้า-สิงหาคม---กันยายน-2569)

---

## ข้อมูลผู้จัดทำ (Student Information)
- **ชื่อ-นามสกุล:** นางสาวณัฐสุดา ร่องทอง (Natsuda Rongthong)
- **รหัสนักศึกษา:** 664259006
- **GitHub Account:** [@Natsuda006](https://github.com/Natsuda006)
- **Target Test Account:** `nan006`
- **ฟังก์ชันที่รับผิดชอบ (Module Scope):**
  - **US-15 / UC-15:** แผงควบคุมผู้ดูแลระบบ (Admin Dashboard)
  - **US-16 / UC-16:** การจัดการผู้ใช้งาน (Admin User Management)

---

## หมายเลขเวอร์ชันของเอกสารและโค้ด (Versioning)

| รายการ | หมายเลขเวอร์ชัน | วันที่ / รอบการทำงาน | คำอธิบาย |
| :--- | :---: | :---: | :--- |
| **เอกสาร User Stories & Test Scenarios** | `v1.0.0` | สิงหาคม - กันยายน 2569 | รูปแบบ BDD Given-When-Then ครอบคลุม 12 Scenarios |
| **เอกสาร Test Cases** | `v1.0.0` | สิงหาคม - กันยายน 2569 | ครอบคลุม 12 Test Cases (Positive 11, Negative 1) ผ่าน 100% |
| **เอกสาร Test Plan & Report** | `v1.0.0` | สิงหาคม - กันยายน 2569 | แผนการทดสอบและรายงานสรุปผลการทดสอบอัตโนมัติ |
| **เอกสารข้อกำหนดโครงการ (Project Scope)** | `v1.0.0` | สิงหาคม - กันยายน 2569 | ขอบเขตการทำงานของฟังก์ชันผู้ดูแลระบบ |
| **GitHub Release / Tag Version** | `v1.0.0` | กันยายน 2569 | สคริปต์ทดสอบ Playwright Test Suite และ Robot Framework Suite |

---

## รายงานความคืบหน้า (สิงหาคม - กันยายน 2569)

โครงการนี้เป็นการแยกส่งเฉพาะส่วนงานของตนเองจากเอกสารกลุ่ม โดยมีความคืบหน้าตามช่วงเวลาดังนี้:

### 1. ความคืบหน้าเดือนสิงหาคม 2569 (August 2026)
- [x] แยกขอบเขต User Stories ส่วนบุคคล ได้แก่ **US-15 (แผงควบคุมผู้ดูแลระบบ)** และ **US-16 (การจัดการผู้ใช้งาน)**
- [x] ออกแบบพฤติกรรมการทดสอบตามแนวทาง **Behavior-Driven Development (BDD)** ในรูปแบบ `Given-When-Then` ทั้งหมด 12 Scenarios
- [x] กำหนดกรณีทดสอบ (Test Cases) รหัส `TC-ADM-001` ถึง `TC-ADM-005` และ `TC-ADM-USR-001` ถึง `TC-ADM-USR-007`
- [x] พัฒนาสคริปต์ทดสอบเบื้องต้นด้วย **Playwright Framework** พร้อมระบบบันทึก Session การเข้าสู่ระบบ (`auth.setup.js`)
- [x] เชื่อมต่อกับระบบทดสอบจริงของ T-Check Frontend: `https://t-check-two.vercel.app`

### 2. ความคืบหน้าเดือนกันยายน 2569 (September 2026)
- [x] พัฒนาชุดทดสอบอัตโนมัติเพิ่มเติมด้วย **Robot Framework**:
  - `robot/admin_dashboard.robot`: ควบคุม UI ผ่าน Browser Library (Chromium)
  - `robot/admin_dashboard_api.robot`: ตรวจสอบความถูกต้องของ API ผ่าน RequestsLibrary
- [x] ปรับปรุงชุดทดสอบเพื่อทำงานกับข้อมูลจริงบนฐานข้อมูล (Real Data Testing):
  - ทดสอบสลับสิทธิ์ผู้ใช้ระหว่าง `user-free` และ `user-pro` และตรวจค่าจริงหลังโหลดหน้าใหม่
  - ทดสอบระงับบัญชี (Ban) และยกเลิกระงับบัญชี (Unban) ของ `nan006` พร้อมตรวจสอบสถานะบนตาราง
  - ทดสอบ Negative Scenario จำลอง API ขัดข้อง (Status 500) และตรวจสอบความทนทานของ UI
- [x] ดำเนินการรันชุดทดสอบครบ 100% ทั้ง Playwright และ Robot Framework โดยทุกเคส **ผ่านการทดสอบ (Passed 12/12)**
- [x] จัดทำเอกสารฉบับสมบูรณ์ (PDF และ Markdown) ติดหมายเลขเวอร์ชัน `v1.0.0` ส่งมอบงานอย่างเป็นทางการ

---

## เอกสารที่เกี่ยวข้อง (Documentation Links)

สามารถเปิดอ่านได้ทั้งในรูปแบบ **PDF ฉบับทางการ** และ **Markdown บน GitHub**:

| เอกสาร | เอกสาร Markdown (อ่านบน GitHub) | เอกสารฉบับทางการ (PDF) |
| :--- | :--- | :--- |
| **User Stories & BDD Scenarios** | [docs/user-stories-and-scenarios.md](./docs/user-stories-and-scenarios.md) | [SPRS-E2E-BDD-UserStories.pdf](./SPRS-E2E-BDD-UserStories.pdf) |
| **Test Cases Specification** | [docs/test-cases.md](./docs/test-cases.md) | [SPRS-Test-Cases.pdf](./SPRS-Test-Cases.pdf) |
| **Test Plan & Test Report** | [docs/test-plan-and-report.md](./docs/test-plan-and-report.md) | [SPRS-Test-Plan-and-Report.pdf](./SPRS-Test-Plan-and-Report.pdf) |
| **Project Scope & Overview** | [docs/project-overview.md](./docs/project-overview.md) | [SPRS-Project-Document.pdf](./SPRS-Project-Document.pdf) |

---

## สรุปผลการทดสอบ (Test Cases Summary)

| รหัส Test Case | ชื่อกรณีทดสอบ | ชนิดการทดสอบ | Playwright | Robot Framework | สถานะ |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **TC-ADM-001** | แสดงข้อมูลสรุปของ Admin Dashboard (การ์ดสถิติ 8 รายการ) | Positive (UI) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-002** | แสดงกราฟและข้อมูลสถิติย้อนหลัง 7 วัน (โทเค็นและคำผิด) | Positive (UI) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-003** | แสดงข้อมูลผู้ใช้งานล่าสุดบน Dashboard (ตาราง 4 คอลัมน์) | Positive (UI) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-004** | ระบบสามารถแสดงหน้า Dashboard ได้เมื่อโหลดข้อมูลสำเร็จ | Positive (UI) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-005** | กรณีระบบไม่สามารถโหลดข้อมูล Dashboard ได้ (Simulated 500) | Negative (UI/API) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-USR-001** | ค้นหาผู้ใช้จากชื่อ (nan006) | Positive (UI) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-USR-002** | กรองรายชื่อผู้ใช้ตามสิทธิ์ Pro (user-pro) | Positive (UI) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-USR-003** | เปิดดูรายละเอียดผู้ใช้ (nan006) | Positive (UI) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-USR-004** | กำหนดสิทธิ์การใช้งานจริงตาม TARGET_ROLE | Positive (UI/Data) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-USR-005** | ระงับบัญชีผู้ใช้งานด้วยข้อมูลจริง (Ban User) | Positive (UI/Data) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-USR-006** | ยกเลิกระงับบัญชีผู้ใช้งานด้วยข้อมูลจริง (Unban User) | Positive (UI/Data) |  Pass |  Pass | **ผ่าน** |
| **TC-ADM-USR-007** | ตรวจสอบหน้าต่างยืนยันการลบบัญชีและกดยกเลิก | Positive (UI) |  Pass |  Pass | **ผ่าน** |

---

## โครงสร้างโปรเจกต์ (Project Structure)

```text
.
├── .github/
├── docs/                                  # เอกสารประกอบการทดสอบ (Markdown Format)
│   ├── project-overview.md                # ข้อกำหนดโครงการ (v1.0.0)
│   ├── test-cases.md                      # รายละเอียด Test Cases ครบทั้ง 12 เคส (v1.0.0)
│   ├── test-plan-and-report.md            # แผนและรายงานผลการทดสอบ (v1.0.0)
│   └── user-stories-and-scenarios.md      # BDD Given-When-Then Scenarios (v1.0.0)
├── robot/                                 # ชุดทดสอบ Robot Framework
│   ├── admin_dashboard.robot              # UI Automated Test (Browser Library)
│   └── admin_dashboard_api.robot          # API Automated Test (RequestsLibrary)
├── tests/                                 # ชุดทดสอบ Playwright
│   ├── admin-dashboard.spec.js            # Playwright Spec File (TC-ADM-001 - 005, TC-ADM-USR-001 - 007)
│   └── auth.setup.js                      # Admin Authentication Setup
├── SPRS-E2E-BDD-UserStories.pdf           # เอกสารฉบับทางการ (PDF v1.0.0)
├── SPRS-Project-Document.pdf              # เอกสารฉบับทางการ (PDF v1.0.0)
├── SPRS-Test-Cases.pdf                    # เอกสารฉบับทางการ (PDF v1.0.0)
├── SPRS-Test-Plan-and-Report.pdf          # เอกสารฉบับทางการ (PDF v1.0.0)
├── .env.example                           # ตัวอย่างการตั้งค่า Environment Variables
├── package.json                           # Node.js Dependencies & Scripts
├── playwright.config.js                   # Playwright Config (วิดีโอ, สกรีนช็อต, Timeout)
├── README.md                              # รายงานภาพรวมโปรเจกต์
└── requirements.txt                       # Python Dependencies (Robot Framework)
```

---

## การติดตั้งและการรันการทดสอบ (Getting Started)

### 1. การเตรียมสภาพแวดล้อมและ Environment Variables
คัดลอกไฟล์ `.env.example` เป็น `.env` และกำหนดค่า:
```bash
cp .env.example .env
```
ค่าตัวแปร:
```ini
PLAYWRIGHT_BASE_URL=https://t-check-two.vercel.app
ADMIN_IDENTITY=บัญชี Admin
ADMIN_PASSWORD=รหัสผ่าน
TARGET_USERNAME=nan006
TARGET_ROLE=user-pro
```

### 2. การรันการทดสอบด้วย Playwright (JavaScript)
ติดตั้ง Dependencies:
```bash
npm install
npx playwright install chromium
```

รันการทดสอบส่วน Admin Dashboard & User Management:
```bash
npm run test:admin
```

เปิดดูรายงานผลและวิดีโอการทดสอบ (HTML Report with Video):
```bash
npm run report
```

### 3. การรันการทดสอบด้วย Robot Framework (Python)
สร้างและเปิดใช้งาน Python Virtual Environment:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
rfbrowser init --skip-browsers
```

สร้าง Admin Session ก่อนเริ่มรัน Robot Framework:
```bash
npx playwright test --project=setup
```

รันชุดทดสอบ UI ผ่าน Browser Library:
```bash
python -m robot -d robot-results robot/admin_dashboard.robot
```

รันชุดทดสอบ API ผ่าน RequestsLibrary:
```bash
python -m robot -d robot-results robot/admin_dashboard_api.robot
```

---

## ลิขสิทธิ์และผู้รับผิดชอบ
จัดทำโดย: **นางสาวณัฐสุดา ร่องทอง (รหัสนักศึกษา 664259006)**  
สาขาวิชาวิศวกรรมซอฟต์แวร์ มหาวิทยาลัยราชภัฏนครปฐม  
ส่งมอบงาน: **รอบความคืบหน้า สิงหาคม - กันยายน 2569**
