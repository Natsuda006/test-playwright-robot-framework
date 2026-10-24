*** Settings ***
Documentation    Robot Framework coverage for the admin dashboard.
Library           Browser
Library           OperatingSystem
Suite Setup       Open Admin Dashboard
Suite Teardown    Close Browser

*** Variables ***
${BASE_URL}       %{PLAYWRIGHT_BASE_URL=https://t-check-two.vercel.app}
${AUTH_STATE}     ${CURDIR}/../playwright/.auth/admin.json
${HEADLESS}       ${FALSE}
${TARGET_USERNAME}    %{TARGET_USERNAME=nan006}
${TARGET_ROLE}    %{TARGET_ROLE=user-pro}

*** Test Cases ***
TC-ADM-001 Dashboard summary is visible
    ${heading}=    Get Text    h1
    Should Contain    ${heading}    แผงควบคุมผู้ดูแลระบบ
    ${dashboard}=    Get Text    body
    Should Contain    ${dashboard}    ผู้ใช้งานทั้งหมด
    Should Contain    ${dashboard}    ผู้ใช้งานระดับ Pro
    Should Contain    ${dashboard}    ผู้ใช้ธรรมดา
    Should Contain    ${dashboard}    ผู้ใช้งานที่ถูกระงับ
    Should Contain    ${dashboard}    การเรียกใช้ AI (วันนี้)
    Should Contain    ${dashboard}    โทเค็นที่ใช้ไปวันนี้
    Should Contain    ${dashboard}    อัตราข้อผิดพลาด (Error Rate)
    Should Contain    ${dashboard}    เวลาตอบสนองเฉลี่ย

TC-ADM-002 Seven-day dashboard charts are displayed
    Go To    ${BASE_URL}/admin
    Wait For Elements State    h1    visible    timeout=10s
    Wait For Elements State    role=heading[name="ปริมาณการใช้โทเค็น (7 วันย้อนหลัง)"]    visible    timeout=10s
    Wait For Elements State    text=ปริมาณการใช้โทเค็น (7 วันย้อนหลัง)    visible    timeout=10s
    Wait For Elements State    text=จำนวนโทเค็นที่ถูกใช้งานในแต่ละวัน    visible    timeout=10s
    Wait For Elements State    role=heading[name="จำนวนการตรวจสอบคำผิด (7 วันย้อนหลัง)"]    visible    timeout=10s
    Wait For Elements State    text=จำนวนครั้งที่เรียกใช้งาน AI ในแต่ละวัน    visible    timeout=10s
    ${chart_count}=    Get Element Count    role=application
    Should Be Equal As Integers    ${chart_count}    2

TC-ADM-003 Recent users are displayed
    ${heading}=    Get Text    h1
    Should Contain    ${heading}    แผงควบคุมผู้ดูแลระบบ
    ${dashboard}=    Get Text    body
    Should Contain    ${dashboard}    รายชื่อผู้ใช้งานล่าสุด
    Should Contain    ${dashboard}    ผู้ใช้งานที่เพิ่งสมัครหรือมีความเคลื่อนไหวล่าสุด
    ${table_count}=    Get Element Count    role=table
    Should Be Equal As Integers    ${table_count}    1
    Wait For Elements State    role=columnheader[name="ชื่อผู้ใช้"]    visible    timeout=10s
    Wait For Elements State    role=columnheader[name="ระดับสมาชิก"]    visible    timeout=10s
    Wait For Elements State    role=columnheader[name="โทเค็นที่ใช้ไปวันนี้"]    visible    timeout=10s
    Wait For Elements State    role=columnheader[name="วันที่ใช้งานล่าสุด"]    visible    timeout=10s

TC-ADM-004 Dashboard remains available after loading
    ${heading}=    Get Text    h1
    Should Contain    ${heading}    แผงควบคุมผู้ดูแลระบบ
    ${dashboard}=    Get Text    body
    Should Not Contain    ${dashboard}    ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่

TC-ADM-005 Dashboard remains available when overview API fails
    Go To    ${BASE_URL}/admin/users
    Install XHR Mocks    mock_overview=${TRUE}
    Click    role=link[name="ภาพรวม"]
    Wait For Elements State    h1    visible    timeout=10s
    ${heading}=    Get Text    h1
    Should Contain    ${heading}    แผงควบคุมผู้ดูแลระบบ
    ${dashboard}=    Get Text    body
    Should Contain    ${dashboard}    ผู้ใช้งานทั้งหมด
    Should Not Contain    ${dashboard}    ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่
    ${requests}=    Evaluate JavaScript    ${None}    () => JSON.stringify(window.__robotMockedRequests)
    Should Contain    ${requests}    /api/dashboard/admin/overview
    ${alerts}=    Evaluate JavaScript    ${None}    () => JSON.stringify(window.__robotAlerts)
    Should Be Equal    ${alerts}    []

TC-ADM-USR-001 Search users by username
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}

TC-ADM-USR-002 Filter users by Pro membership
    Go To    ${BASE_URL}/admin/users
    Select Options By    css=select >> nth=0    value    user-pro
    Wait For Function
    ...    () => Array.from(document.querySelectorAll('tbody tr')).length > 0 && Array.from(document.querySelectorAll('tbody tr')).every(row => row.innerText.includes('user-pro'))
    ...    timeout=10s
    ${users}=    Get Text    tbody
    Should Contain    ${users}    user-pro
    Should Not Contain    ${users}    user-free

TC-ADM-USR-003 Open a user's details
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    Click    css=tbody tr:has-text("${TARGET_USERNAME}") a[href^="/admin/users/"]
    Wait For Elements State    h1    visible    timeout=10s
    ${heading}=    Get Text    h1
    Should Contain    ${heading}    ${TARGET_USERNAME}
    ${url}=    Get Url
    Should Match Regexp    ${url}    /admin/users/[^/]+$
    Wait For Elements State    role=heading[name="สิทธิ์การใช้งาน"]    visible    timeout=10s
    Wait For Elements State    role=heading[name="เขตอันตราย (ลบบัญชี)"]    visible    timeout=10s

TC-ADM-USR-004 Set role to TARGET_ROLE using real data
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    Click    css=tbody tr:has-text("${TARGET_USERNAME}") a[href^="/admin/users/"]
    Wait For Elements State    css=h2 >> nth=0    visible    timeout=10s
    ${current_role}=    Get Property    css=select    value
    Should Be True    '${TARGET_ROLE}' in ('user-free', 'user-pro')    TARGET_ROLE must be user-free or user-pro
    IF    '${current_role}' != '${TARGET_ROLE}'
        Select Options By    css=select    value    ${TARGET_ROLE}
        Click    text=บันทึก
        Wait For Elements State    text=อัปเดตข้อมูลผู้ใช้สำเร็จ    visible    timeout=10s
    END
    Reload
    Wait For Elements State    h1    visible    timeout=10s
    ${saved_role}=    Get Property    css=select    value
    Should Be Equal    ${saved_role}    ${TARGET_ROLE}
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    ${saved_user}=    Get Text    tbody
    Should Contain    ${saved_user}    ${TARGET_ROLE}

TC-ADM-USR-005 Suspend user account with real data
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    Click    css=tbody tr:has-text("${TARGET_USERNAME}") a[href^="/admin/users/"]
    Wait For Elements State    h1    visible    timeout=10s
    Wait For Elements State    text=ระงับบัญชีผู้ใช้    visible    timeout=10s
    ${is_checked}=    Get Checkbox State    css=div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]
    IF    not ${is_checked}
        Check Checkbox    css=div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]
        Click    text=บันทึก
        Wait For Elements State    text=อัปเดตข้อมูลผู้ใช้สำเร็จ    visible    timeout=10s
    END
    ${saved_state}=    Get Checkbox State    css=div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]
    Should Be True    ${saved_state}
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    ${user_row}=    Get Text    tbody
    Should Contain    ${user_row}    ถูกระงับ (Banned)

TC-ADM-USR-006 Unsuspend user account with real data
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    Click    css=tbody tr:has-text("${TARGET_USERNAME}") a[href^="/admin/users/"]
    Wait For Elements State    h1    visible    timeout=10s
    Wait For Elements State    text=ระงับบัญชีผู้ใช้    visible    timeout=10s
    ${is_checked}=    Get Checkbox State    css=div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]
    IF    ${is_checked}
        Uncheck Checkbox    css=div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]
        Click    text=บันทึก
        Wait For Elements State    text=อัปเดตข้อมูลผู้ใช้สำเร็จ    visible    timeout=10s
    END
    ${saved_state}=    Get Checkbox State    css=div:has-text("ระงับบัญชีผู้ใช้") input[type="checkbox"]
    Should Not Be True    ${saved_state}
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    ${user_row}=    Get Text    tbody
    Should Contain    ${user_row}    ปกติ

TC-ADM-USR-007 Open deletion dialog and cancel
    Go To    ${BASE_URL}/admin/users
    Fill Text    css=input[placeholder="ค้นหาจากชื่อ หรืออีเมล..."]    ${TARGET_USERNAME}
    Wait Until Keyword Succeeds    10s    500ms    Search Results Show One Matching User    ${TARGET_USERNAME}
    Click    css=tbody tr:has-text("${TARGET_USERNAME}") a[href^="/admin/users/"]
    Wait For Elements State    h1    visible    timeout=10s
    Wait For Elements State    text=เขตอันตราย (ลบบัญชี)    visible    timeout=10s
    Click    text=ลบผู้ใช้งานนี้ถาวร
    Wait For Elements State    role=dialog    visible    timeout=10s
    ${dialog}=    Get Text    role=dialog
    Should Contain    ${dialog}    ไม่สามารถย้อนกลับได้
    Click    role=dialog >> role=button[name="ยกเลิก"]
    Wait For Elements State    role=dialog    detached    timeout=10s
    ${heading}=    Get Text    h1
    Should Contain    ${heading}    ${TARGET_USERNAME}

*** Keywords ***
Open Admin Dashboard
    File Should Exist    ${AUTH_STATE}    Run the Playwright setup project to create the admin session first.
    New Browser    chromium    headless=${HEADLESS}    channel=chrome
    New Context    storageState=${AUTH_STATE}
    New Page    ${BASE_URL}/admin
    Wait For Elements State    h1    visible    timeout=15s
    ${heading}=    Get Text    h1
    Should Contain    ${heading}    แผงควบคุมผู้ดูแลระบบ

Search Results Show One Matching User
    [Arguments]    ${username}
    ${matching_row_count}=    Get Element Count    css=tbody tr:has-text("${username}")
    Should Be Equal As Integers    ${matching_row_count}    1
    ${user_row}=    Get Text    css=tbody tr:has-text("${username}")
    Should Contain    ${user_row}    ${username}

Install XHR Mocks
    [Arguments]    ${mock_overview}=${TRUE}
    ${options}=    Create Dictionary    mockOverview=${mock_overview}
    Evaluate JavaScript    ${None}
    ...    (options) => {
    ...        window.__robotMockedRequests = [];
    ...        window.__robotAlerts = [];
    ...        window.alert = (message) => window.__robotAlerts.push(String(message));
    ...        const originalFetch = window.fetch.bind(window);
    ...        window.fetch = (input, init = {}) => {
    ...            const url = typeof input === "string" ? input : input.url;
    ...            const method = String(init.method || (typeof input === "string" ? "GET" : input.method)).toUpperCase();
    ...            const isOverview = options.mockOverview && method === "GET" && url.includes("/api/dashboard/admin/overview");
    ...            if (!isOverview) return originalFetch(input, init);
    ...            window.__robotMockedRequests.push({ method, url, body: init.body ? String(init.body) : "", status: 500 });
    ...            return Promise.resolve(new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500, headers: { "content-type": "application/json" } }));
    ...        };
    ...        const originalOpen = XMLHttpRequest.prototype.open;
    ...        const originalSend = XMLHttpRequest.prototype.send;
    ...        XMLHttpRequest.prototype.open = function(method, url, ...args) {
    ...            this.__robotMethod = String(method).toUpperCase();
    ...            this.__robotUrl = String(url);
    ...            return originalOpen.call(this, method, url, ...args);
    ...        };
    ...        XMLHttpRequest.prototype.send = function(body) {
    ...            const isOverview = options.mockOverview && this.__robotMethod === "GET" && this.__robotUrl.includes("/api/dashboard/admin/overview");
    ...            if (!isOverview) return originalSend.call(this, body);
    ...            const status = 500;
    ...            const responseText = JSON.stringify({ message: "Internal Server Error" });
    ...            window.__robotMockedRequests.push({ method: this.__robotMethod, url: this.__robotUrl, body: body ? String(body) : "", status });
    ...            Object.defineProperties(this, { readyState: { configurable: true, value: 4 }, status: { configurable: true, value: status }, statusText: { configurable: true, value: "Internal Server Error" }, responseText: { configurable: true, value: responseText }, response: { configurable: true, value: responseText } });
    ...            this.getAllResponseHeaders = () => "content-type: application/json" + String.fromCharCode(13, 10);
    ...            queueMicrotask(() => { this.dispatchEvent(new Event("readystatechange")); this.dispatchEvent(new Event("load")); this.dispatchEvent(new Event("loadend")); });
    ...        };
    ...        return true;
    ...    }
    ...    arg=${options}