# Restful Booker — Playwright E2E Automation Framework

A personal automation project built to demonstrate end-to-end test framework design using **Playwright** and **TypeScript**. The project targets [automationintesting.online](https://automationintesting.online/) and covers core user journeys across the booking, room, and contact features.

> ⚠️ Work in progress — actively being extended with new test scenarios and an API test layer.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev/) | Browser automation & test runner |
| TypeScript | Strongly-typed test code |
| Faker.js | Dynamic randomised test data |
| GitHub Actions | CI/CD pipeline |

---

## 📁 Project Structure

```
├── pages/
│   ├── BasePage.ts        # Shared base class — navigation & page load utilities
│   ├── HomePage.ts        # Home page interactions
│   ├── BookingPage.ts     # Room booking flow — date selection, form fill, validation
│   ├── RoomPage.ts        # Room detail page — title, image, policies
│   ├── ContactPage.ts     # Contact form — submission and validation
│   ├── POManager.ts       # Page Object Manager — central factory for all pages
│   ├── TestData.ts        # Faker-based dynamic test data generation
│   └── fixtures.ts        # Custom Playwright fixtures — setup, teardown, isolation
├── tests/
│   ├── homepage.spec.ts   # Homepage UI validation
│   ├── roompage.spec.ts   # Room detail page validation
│   ├── booking.spec.ts    # Booking flow — positive & negative scenarios
│   └── contact.spec.ts    # Contact form — positive & negative scenarios
├── .github/
│   └── workflows/
│       └── playwright.yml # GitHub Actions CI/CD pipeline
├── playwright.config.ts   # Playwright configuration — browsers, baseURL, reporting
└── package.json
```

---

## 🏗️ Framework Design

### BasePage — Shared Base Class
All page objects extend `BasePage`, which provides shared `navigate()` and `waitForPageLoad()` utilities. This avoids duplication and ensures consistent behaviour across all pages.

### POManager — Page Object Manager
A central `POManager` class instantiates all page objects in one place and is injected into every test via a custom fixture. Tests access all pages through a single `pom` object — keeping test files clean and free of setup logic.

### Custom Fixtures — Test Isolation
`fixtures.ts` extends Playwright's base `test` object with a `pom` fixture that handles full setup before each test:
- Sets viewport to 1920×1080
- Navigates to the base URL
- Clears `localStorage` and `sessionStorage` to prevent state leaking between tests
- Reloads the page to a guaranteed clean state
- Closes the page after each test

### Dynamic Test Data
`TestData.ts` uses Faker.js to generate randomised booking and contact details on every test run. No hardcoded values anywhere in the test layer — each run is independent.

### Environment-Based Configuration
The base URL is managed via `playwright.config.ts` using an environment variable, allowing tests to run against different environments without touching code:

```bash
# Default — runs against production
npx playwright test

# Run against a different environment
BASE_URL=https://staging.example.com npx playwright test
```

---

## ✅ Test Coverage

| Area | Test Scenarios |
|---|---|
| Homepage | All main UI elements visible, navigation links |
| Room Page | Room title matches selection, image visible, description and policies present |
| Booking | Successful booking flow end-to-end, validation errors on empty submission |
| Contact Form | Successful submission with dynamic data, validation errors on empty submission |

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

### Running Tests

```bash
# Run all tests
npx playwright test

# Run a specific test file
npx playwright test tests/booking.spec.ts

# Run in headed mode
npx playwright test --headed

# Run on a specific browser
npx playwright test --project=chromium

# Run against a different environment
BASE_URL=https://staging.example.com npx playwright test
```

### View the HTML Report

```bash
npx playwright show-report
```

---

## ⚙️ CI/CD

Tests run automatically on every push and pull request to `main` via GitHub Actions across **Chromium**, **Firefox**, and **WebKit**. The full HTML report is uploaded as a build artifact and retained for 30 days.

---

## 📌 Notes

- This project targets [automationintesting.online](https://automationintesting.online/), a public shared demo environment that occasionally returns server errors. The booking tests handle this gracefully using `test.skip()` to avoid false failures caused by third-party instability.
- Test coverage is intentionally scoped to selected user journeys. The framework is designed to be extended incrementally.

---

## 🔭 Planned Improvements

- [ ] Add negative test scenarios with invalid data variants (invalid email, short phone, special characters)
- [ ] Add API test layer for Restful Booker endpoints
