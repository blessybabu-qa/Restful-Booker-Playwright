# Restful Booker — Playwright E2E Automation Framework

A personal automation project built to demonstrate end-to-end test framework design using **Playwright** and **TypeScript**. The project targets [automationintesting.online](https://automationintesting.online/) and covers core user journeys across the booking, room, contact, and admin features.

> ⚠️ Work in progress — actively being extended with new test scenarios.

---

## 🛠️ Tech Stack

| Tool                               | Purpose                          |
| ---------------------------------- | -------------------------------- |
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| TypeScript                         | Strongly-typed test code         |
| Faker.js                           | Dynamic randomised test data     |
| dotenv                             | Environment variable management  |
| GitHub Actions                     | CI/CD pipeline                   |

---

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

---

## 🏗️ Framework Design

### BasePage — Shared Base Class

All page objects extend `BasePage`, which provides shared `navigate()`, `waitForPageLoad()`, `waitAndFill()`, and `waitAndClick()` utilities. This avoids duplication and ensures consistent behaviour across all pages.

### POManager — Page Object Manager

A central `POManager` class instantiates all page objects in one place and is injected into every test via a custom fixture. Tests access all pages through a single `pom` object — keeping test files clean and free of setup logic.

### Custom Fixtures — Test Isolation

`fixtures.ts` extends Playwright's base `test` object with a `pom` fixture that handles full setup before each test:

- Sets viewport to 1920×1080
- Navigates to the base URL
- Clears `localStorage` and `sessionStorage` to prevent state leaking between tests
- Reloads the page to a guaranteed clean state
- Closes the page after each test

API fixtures provide a `bookingService`, a `preCreatedBookingId` (booking created before the test runs), and an `authToken` — keeping test logic clean and setup out of spec files.

### Dynamic Test Data

`TestData.ts` uses Faker.js to generate randomised booking, contact, and API payload data on every test run. No hardcoded values anywhere in the test layer — each run is independent and produces unique data.

### Environment-Based Configuration

Sensitive credentials and environment-specific URLs are managed via a `.env` file (locally) and GitHub Actions secrets/variables (in CI). This keeps credentials out of source code and allows tests to run against different environments without touching code.

```
# .env (local — do not commit)
BASE_URL=<site URL>
ADMIN_EMAIL=<your-admin-email>
ADMIN_PASSWORD=<your-admin-password>
API_URL=<api base URL>
API_ADMIN_TOKEN=<bearer token for protected endpoints>
```

---

## ✅ Test Coverage

### UI Tests

| Area         | Scenario                                                                      | Type     |
| ------------ | ----------------------------------------------------------------------------- | -------- |
| Homepage     | All main UI elements visible                                                  | Positive |
| Room Page    | Room title matches selection, image visible, description and policies present | Positive |
| Booking      | Successful end-to-end room booking flow                                       | Positive |
| Booking      | Validation errors on empty form submission                                    | Negative |
| Contact Form | Successful submission with dynamic data                                       | Positive |
| Contact Form | Validation errors on empty form submission                                    | Negative |
| Admin Login  | Successful login with valid credentials                                       | Positive |

### API Tests

| Endpoint            | Scenario                                          | Type     |
| ------------------- | ------------------------------------------------- | -------- |
| GET /ping           | Service health check returns 201                  | Positive |
| POST /booking       | Create booking, verify ID returned                | Positive |
| GET /booking/:id    | Retrieve booking by fixture-generated ID          | Positive |
| PATCH /booking/:id  | Partial update, verify changed & unchanged fields | Positive |
| PUT /booking/:id    | Full update with dynamic token and payload        | Positive |
| DELETE /booking/:id | Delete booking, verify 404 on subsequent GET      | Positive |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/blessybabu-qa/Restful-Booker-Playwright.git
cd Restful-Booker-Playwright

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Setup

Create a `.env` file in the project root:

```
BASE_URL=<site URL>
ADMIN_EMAIL=<your-admin-email>
ADMIN_PASSWORD=<your-admin-password>
API_URL=<api base URL>
API_ADMIN_TOKEN=<bearer token>
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/UI/booking.spec.ts

# Run in headed mode
npx playwright test --headed

# Run on a specific browser
npx playwright test --project=ui-chromium

# Run only API tests
npx playwright test --project=setup --project=api-tests

# Run against a different environment
BASE_URL=https://staging.example.com npx playwright test
```

### View the HTML Report

```bash
npx playwright show-report
```

---

## ⚙️ CI/CD

Tests run automatically on every push and pull request to `main` via GitHub Actions. The pipeline is split into two independent jobs:

- **Backend: API Suite** — runs the `setup` (ping) and `api-tests` projects
- **Frontend: UI Suite** — runs `ui-chromium`, `ui-firefox`, and `ui-webkit`

The full HTML report is uploaded as a build artifact and retained for 30 days.

The following repository secrets and variables must be configured in GitHub:

| Name                | Type     | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| `ADMIN_EMAIL`     | Secret   | Admin login email                        |
| `ADMIN_PASSWORD`  | Secret   | Admin login password                     |
| `API_ADMIN_TOKEN` | Secret   | Bearer token for protected API endpoints |
| `BASE_URL`        | Variable | UI target environment URL                |
| `API_URL`         | Variable | API target environment URL               |

---

## 📌 Notes

- This project targets [automationintesting.online](https://automationintesting.online/), a public shared demo environment that occasionally returns server errors. Booking tests handle this gracefully using `test.skip()` to avoid false failures caused by third-party instability.
- Test coverage is intentionally scoped to selected user journeys. The framework is designed to be extended incrementally.

---

## 🔭 Planned Improvements

- [ ] Add negative UI test cases with invalid data variants (invalid email format, phone too short, special characters in name fields)
- [ ] Add negative admin login test (invalid credentials, empty fields)

