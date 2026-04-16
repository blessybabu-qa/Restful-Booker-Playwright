# Restful Booker — Playwright E2E Automation Framework

A personal automation project built to demonstrate end-to-end test framework design using **Playwright** and **TypeScript**. The project targets [automationintesting.online](https://automationintesting.online) and covers core user journeys across the booking, room, contact, and admin features.

> ⚠️ Work in progress — actively being extended with new test scenarios.

## 🛠️ Tech Stack

| Tool             | Purpose                           |
|------------------|-----------------------------------|
| Playwright       | Browser automation & test runner  |
| TypeScript       | Strongly-typed test code          |
| Faker.js         | Dynamic randomised test data      |
| dotenv           | Environment variable management   |
| Allure Report    | Test reporting & history tracking |
| Firebase Hosting | Live report deployment            |
| GitHub Actions   | CI/CD pipeline                    |

## 📁 Project Structure

```
└── blessybabu-qa-restful-booker-playwright/
    ├── README.md
    ├── package.json
    ├── playwright.config.ts
    ├── api-clients/
    │   ├── BaseService.ts
    │   └── BookingService.ts
    ├── pages/
    │   ├── AdminLoginPage.ts
    │   ├── BasePage.ts
    │   ├── BookingPage.ts
    │   ├── ContactPage.ts
    │   ├── fixtures.ts
    │   ├── HomePage.ts
    │   ├── POManager.ts
    │   ├── RoomPage.ts
    │   └── TestData.ts
    ├── tests/
    │   ├── api/
    │   │   ├── api-ping.spec.ts
    │   │   ├── create-booking.spec.ts
    │   │   ├── delete.booking.spec.ts
    │   │   ├── get-booking.spec.ts
    │   │   ├── patch-booking.spec.ts
    │   │   └── put-booking.spec.ts
    │   └── UI/
    │       ├── booking.spec.ts
    │       ├── contact.spec.ts
    │       ├── homepage.spec.ts
    │       ├── login.spec.ts
    │       └── roompage.spec.ts
    └── .github/
        └── workflows/
            └── playwright.yml
```

## 🏗️ Framework Design

### BasePage — Shared Base Class
All page objects extend BasePage, which provides shared navigate, waitForPageLoad, waitAndFill, and waitAndClick utilities. This avoids duplication and ensures consistent behaviour across all pages.

### POManager — Page Object Manager
A central POManager class instantiates all page objects in one place and is injected into every test via a custom fixture. Tests access all pages through a single pom object — keeping test files clean and free of setup logic.

### Custom Fixtures — Test Isolation
fixtures.ts extends Playwright's base test object with a pom fixture that handles full setup before each test:

- Sets viewport to 1920×1080
- Navigates to the base URL
- Clears localStorage and sessionStorage to prevent state leaking between tests
- Reloads the page to a guaranteed clean state
- Closes the page after each test

API fixtures provide a bookingService, a preCreatedBookingId (booking created before the test runs), and an authToken — keeping test logic clean and setup out of spec files.

### Dynamic Test Data
TestData.ts uses Faker.js to generate randomised booking, contact, and API payload data on every test run. No hardcoded values anywhere in the test layer — each run is independent and produces unique data.

### Data-Driven Testing
The admin login suite uses a data-driven approach powered by TestData.getAdminLoginScenarios(). A single loop in login.spec.ts iterates over an array of scenarios — each with a username, password, and a valid/invalid flag — and dynamically generates a named test for each one. Adding a new login scenario requires only a new entry in TestData.ts with no changes to the spec file needed. This pattern currently covers a valid login, invalid random credentials, an SQL injection attempt, and an empty username submission.

### Environment-Based Configuration
Sensitive credentials and environment-specific URLs are managed via a .env file locally and GitHub Actions secrets and variables in CI. This keeps credentials out of source code and allows tests to run against different environments without touching any code.

## ✅ Test Coverage

### UI Tests

| Area         | Scenario                                                                      | Type     |
|--------------|-------------------------------------------------------------------------------|----------|
| Homepage     | All main UI elements visible                                                  | Positive |
| Room Page    | Room title matches selection, image visible, description and policies present | Positive |
| Booking      | Successful end-to-end room booking flow                                       | Positive |
| Booking      | Validation errors on empty form submission                                    | Negative |
| Contact Form | Successful submission with dynamic data                                       | Positive |
| Contact Form | Validation errors on empty form submission                                    | Negative |
| Admin Login  | Valid credentials — data-driven                                               | Positive |
| Admin Login  | Invalid random credentials — data-driven                                      | Negative |
| Admin Login  | SQL injection attempt — data-driven                                           | Negative |
| Admin Login  | Empty username — data-driven                                                  | Negative |

### API Tests

| Endpoint            | Scenario                                          | Type     |
|---------------------|---------------------------------------------------|----------|
| GET /ping           | Service health check returns 201                  | Positive |
| POST /booking       | Create booking, verify ID returned                | Positive |
| GET /booking/:id    | Retrieve booking by fixture-generated ID          | Positive |
| PATCH /booking/:id  | Partial update, verify changed & unchanged fields | Positive |
| PUT /booking/:id    | Full update with dynamic token and payload        | Positive |
| DELETE /booking/:id | Delete booking, verify 404 on subsequent GET      | Positive |

## 🧩 Technical Challenges & Solutions

Building this framework against a live, shared demo environment exposed problems that a controlled test environment never would. Here is where things got genuinely hard and how I solved them.

---

### Challenge 1: Booking a Room Without Knowing Which Dates Are Free

The booking calendar renders a live React Big Calendar populated with real reservations from a shared demo site. There is no API to query availability, no data attribute on cells to indicate a blocked day, and no pattern to predict which dates would be free on any given run.

Hardcoding a date range worked locally but failed in CI because another user had already booked those dates. The solution was to write a dynamic date-picker that scans the visible calendar grid at runtime, iterates over every visible day cell, checks each one for the presence of an existing booking marker, and finds the first consecutive free pair before performing the drag. If the entire current month is fully booked, the logic navigates forward to the next month and repeats — up to five months ahead. This makes the test resilient to any real-world booking state on the shared environment.

---

### Challenge 2: Third-Party Server Instability

The target site is a shared demo environment used by QA practitioners globally. Mid-test it occasionally throws an application error page — not a test failure, just server noise from the third party.

Rather than letting the test fail with a misleading assertion error, the booking success check detects the error page first and returns early if found. The spec then marks the test as skipped with a clear explanation. This keeps the suite clean for genuine failures while making third-party instability visible in the report as intentional skips rather than false negatives.

---

### Challenge 3: API Authentication — Two Methods, One Codebase

The Restful Booker API supports two authentication approaches: a Bearer token in the Authorization header for PATCH requests, and a session cookie for PUT and DELETE. Getting these wrong produces a silent 403 with no useful error message.

The solution was to split authentication strategy by HTTP method in BookingService.ts. The patch method reads the bearer token from the environment, stored as a CI secret, while the update and delete methods accept a dynamic token generated fresh per test via a dedicated fixture. Protected tests never share tokens and never depend on a static credential that could expire between runs.

---

### Challenge 4: Preventing Silent Credential Failures in Data-Driven Tests

The login scenarios array includes the live admin credentials read from environment variables. If the .env file is missing or a CI secret is not configured, the positive scenario silently receives undefined and attempts to log in with the literal string "undefined" — producing a confusing false negative with no obvious cause in the report.

The solution was to add an explicit guard in loginAsAdmin() that throws a descriptive error immediately if either credential resolves to undefined. This surfaces misconfiguration at the point of failure rather than burying it inside an assertion mismatch several steps later.

---

### Challenge 5: API Tests Depending on Pre-Existing Data

Several API tests — GET by ID, PATCH, PUT, and DELETE — need a booking to exist before the test body runs. Creating it inside the test mixes setup with assertion logic and makes setup failures indistinguishable from test failures.

The preCreatedBookingId fixture handles creation before the test runs and exposes only the resulting ID. The authToken fixture similarly generates a fresh token per test. Both are composed in fixtures.ts using Playwright's fixture dependency graph, so any test that needs pre-existing data simply declares it as a parameter and the framework handles everything else automatically.

---

## 🤖 How I Used AI in This Project

I used AI as a pairing tool at specific points where the problem was well-defined but the solution required specialist knowledge I did not have on hand.

The calendar drag implementation was the most significant case. React Big Calendar uses synthetic drag events and a standard drag-and-drop sequence does not trigger date selection. I used AI to understand that the library responds to a mouse-down, mouse-move with enough incremental steps to register as a drag, followed by mouse-up — and to work out the correct coordinate maths for targeting cell centres using bounding box data. The dynamic availability-scanning logic that wraps the drag was written by me independently.

The XPath traversal used to detect existing bookings on a day cell also involved AI guidance. The booking event element sits as a sibling in the DOM rather than a direct child of the day cell, meaning a straightforward descendant selector will not reach it. I used AI to identify the correct traversal path, then integrated it into the availability-checking loop myself.

Everything else — fixture architecture, page object design, authentication strategy, CI pipeline, data-driven structure — I designed and built independently, using AI only to look things up the same way I would use documentation.

---

## 📚 What I Learned

**Framework design matters more than test count.** Early on I wrote tests directly in spec files. Refactoring everything into POManager and fixtures was time-consuming, but it made every test written after it faster to build and far easier to debug. The lesson is to invest in the framework before investing in coverage.

**Fixtures are a first-class design tool.** Playwright's fixture system is more powerful than I initially appreciated. Treating pre-created booking IDs and auth tokens as fixtures rather than in-test setup changed how I think about test isolation — setup is not boilerplate, it is infrastructure that belongs in a composable, reusable layer.

**Data-driven testing scales better than duplicated specs.** The login suite started as separate positive and negative test cases. Refactoring it into a data-driven loop made it trivial to add the SQL injection and empty-field scenarios without touching the spec file at all. The pattern will carry forward as the suite grows.

**Shared environments will break your tests in creative ways.** Hardcoded dates, assumptions about server state, and fixed credentials all failed me here. Tests that discover their own preconditions at runtime are the only reliable solution when you do not control the environment.

**CI is not optional.** Running tests locally on one browser hides enormous amounts of flakiness. Setting up GitHub Actions early surfaced cross-browser timing differences — especially in WebKit — before they could become ingrained habits.

**TypeScript discipline pays off.** Strict typing caught several integration mistakes between BookingService and the fixture layer before they ever ran — failures that a dynamically typed approach would only have surfaced at runtime in the middle of a test run.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS)
- npm

### Installation

Clone the repository, install dependencies with npm install, then install Playwright browsers with npx playwright install.

### Environment Setup

Create a .env file in the project root with the following variables:

- BASE_URL — the target site URL
- ADMIN_EMAIL — admin login email
- ADMIN_PASSWORD — admin login password
- API_URL — the API base URL
- API_ADMIN_TOKEN — bearer token for protected endpoints

### Running Tests

Run all tests with npx playwright test. You can target a specific file, run in headed mode with --headed, select a browser project with --project, or run only the API suite by specifying the setup and api-tests projects.

### View the HTML Report

Run npx playwright show-report after a test run to open the built-in Playwright HTML report in your browser.

## 📊 Test Reports

### Allure Report — Live on Firebase

An Allure report is automatically generated on every CI run and deployed to Firebase Hosting.

🔗 **[View Latest Allure Report](https://restful-booker-qa.web.app)**
<img width="2538" height="1296" alt="allure report" src="https://github.com/user-attachments/assets/6ec579cc-0668-49e5-bf2b-26db4dbbf7a4" />

The report provides:
- Full test suite breakdown by feature and spec file
- Pass/fail status per test with step-level detail
- Timeline view across parallel browser runs
- History and trend tracking across builds

### Generating Allure Report Locally

Run the tests first to produce the allure-results directory, then use the allure generate and allure open commands to build and view the report locally.

## ⚙️ CI/CD

Tests run automatically on every push and pull request to main via GitHub Actions. The pipeline is split into two independent jobs:

- **Backend: API Suite** — runs the setup (ping) and api-tests projects
- **Frontend: UI Suite** — runs ui-chromium, ui-firefox, and ui-webkit

After each run, the Allure report is generated from the combined results and deployed to Firebase Hosting, replacing the previous report with the latest build. The full HTML report is also uploaded as a build artifact and retained for 30 days.

The following repository secrets and variables must be configured in GitHub:

| Name            | Type     | Description                              |
|-----------------|----------|------------------------------------------|
| ADMIN_EMAIL     | Secret   | Admin login email                        |
| ADMIN_PASSWORD  | Secret   | Admin login password                     |
| API_ADMIN_TOKEN | Secret   | Bearer token for protected API endpoints |
| BASE_URL        | Variable | UI target environment URL                |
| API_URL         | Variable | API target environment URL               |

## 📌 Notes

- This project targets automationintesting.online, a public shared demo environment that occasionally returns server errors. Booking tests handle this gracefully by skipping rather than failing to avoid false results caused by third-party instability.
- Test coverage is intentionally scoped to selected user journeys. The framework is designed to be extended incrementally.

## 🔭 Planned Improvements

- [ ] Add negative UI test cases with invalid data variants such as invalid email format, phone number too short, and special characters in name fields
