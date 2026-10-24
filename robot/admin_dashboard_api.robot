*** Settings ***
Documentation    API-only checks for admin dashboard endpoints.
Library           Collections
Library           RequestsLibrary
Library           OperatingSystem
Suite Setup       Create Authenticated API Session
Suite Teardown    Delete All Sessions

*** Variables ***
${API_BASE_URL}   %{API_BASE_URL=https://tcheck-backend-real.onrender.com}
${AUTH_STATE}     ${CURDIR}/../playwright/.auth/admin.json

*** Test Cases ***
TC-API-ADM-001 Overview endpoint returns JSON
    ${response}=    GET On Session    admin-api    /api/dashboard/admin/overview    expected_status=200
    ${payload}=    Evaluate    $response.json()
    ${is_json}=    Evaluate    isinstance($payload, (dict, list))
    Should Be True    ${is_json}

TC-API-ADM-002 Recent users endpoint returns JSON
    ${response}=    GET On Session    admin-api    /api/dashboard/admin/users    expected_status=200
    ${payload}=    Evaluate    $response.json()
    ${is_json}=    Evaluate    isinstance($payload, (dict, list))
    Should Be True    ${is_json}

*** Keywords ***
Create Authenticated API Session
    File Should Exist    ${AUTH_STATE}    Run the Playwright setup project to create the admin session first.
    ${storage_state}=    Evaluate    json.load(open($AUTH_STATE, encoding="utf-8"))    modules=json
    ${cookies}=    Get From Dictionary    ${storage_state}    cookies
    ${cookie_pairs}=    Create List
    FOR    ${cookie}    IN    @{cookies}
        ${name}=    Get From Dictionary    ${cookie}    name
        ${value}=    Get From Dictionary    ${cookie}    value
        ${pair}=    Catenate    SEPARATOR==    ${name}    ${value}
        Append To List    ${cookie_pairs}    ${pair}
    END
    ${cookie_header}=    Catenate    SEPARATOR=;    @{cookie_pairs}
    Should Not Be Empty    ${cookie_header}    Admin storage state does not contain authentication cookies.
    ${headers}=    Create Dictionary    Cookie=${cookie_header}    Accept=application/json
    Create Session    admin-api    ${API_BASE_URL}    headers=${headers}