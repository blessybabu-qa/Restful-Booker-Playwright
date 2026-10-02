# Restful Booker — Playwright E2E Automation Framework

A complete, production-ready E2E automation framework built with **Playwright** and **TypeScript** — covering UI testing, REST API automation (GET/POST/PUT/PATCH/DELETE), **visual regression testing across desktop and mobile devices**, cross-browser CI/CD, Docker, and live Allure reporting across the booking, room, contact, and admin features of [automationintesting.online](https://automationintesting.online).

## 🛠️ Tech Stack

| Tool             | Purpose                                                          |
| ---------------- | ---------------------------------------------------------------- |
| Playwright       | Browser automation, test runner & screenshot comparison          |
| TypeScript       | Strongly-typed test code                                         |
| Faker.js         | Dynamic randomised test data                                     |
| dotenv           | Environment variable management                                  |
| Allure Report    | Test reporting & history tracking                                |
| Firebase Hosting | Live report deployment                                           |
| GitHub Actions   | CI/CD pipeline                                                   |
| Docker           | Containerised, reproducible runs and consistent visual baselines |

## 📁 Project Structure

```
└── blessybabu-qa-restful-booker-playwright/
    ├── README.md
    ├── Dockerfile
    ├── firebase.json
    ├── package.json
    ├── playwright.config.ts
    ├── tsconfig.json
    ├── .dockerignore
    ├── .firebaserc
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
    │   │   ├── delete-booking.spec.ts
    │   │   ├── get-booking.spec.ts
    │   │   ├── patch-booking.spec.ts
    │   │   └── put-booking.spec.ts
    │   ├── UI/
    │   │   ├── booking.spec.ts
    │   │   ├── contact.spec.ts
    │   │   ├── homepage.spec.ts
    │   │   ├── login.spec.ts
    │   │   └── roompage.spec.ts
    │   └── visual/
    │       ├── visual.spec.ts
    │       └── visual.spec.ts-snapshots/   # baseline screenshots per device and OS
    └── .github/
        └── workflows/
            ├── playwright.yml
            └── docker-tests.yml
```

## 🐳 Running with Docker (Recommended — No credentials needed from me)

> **For anyone reviewing this project:** All values below are the publicly documented default credentials for automationintesting.online — a shared demo environment built specifically for QA practice. You do not need anything from me to run this project.

### Prerequisites

- Docker Desktop installed and running
- No local Node.js or Playwright installation required

### Step 1 — Clone the repository

```bash
git clone https://github.com/blessybabu-qa/Restful-Booker-Playwright.git
cd Restful-Booker-Playwright
```

### Step 2 — Create the `.env` file

The project reads credentials from a `.env` file at runtime. Create it in the project root with the values below — these are the public defaults for the demo site, not private secrets.

**macOS / Linux (Terminal)**

```bash
cat > .env << 'EOF'
BASE_URL=https://automationintesting.online
API_URL=https://restful-booker.herokuapp.com
ADMIN_EMAIL=admin
ADMIN_PASSWORD=password
API_ADMIN_TOKEN=Basic YWRtaW46cGFzc3dvcmQxMjM=
API_ADMIN_USER=admin
API_ADMIN_PASSWORD=password123
EOF
```

**Windows (PowerShell)**

```powershell
@"
BASE_URL=https://automationintesting.online
API_URL=https://restful-booker.herokuapp.com
ADMIN_EMAIL=admin
ADMIN_PASSWORD=password
API_ADMIN_TOKEN=Basic YWRtaW46cGFzc3dvcmQxMjM=
API_ADMIN_USER=admin
API_ADMIN_PASSWORD=password123
"@ | Set-Content .env
```

**Windows (Command Prompt)**

```cmd
(
echo BASE_URL=https://automationintesting.online
echo API_URL=https://restful-booker.herokuapp.com
echo ADMIN_EMAIL=admin
echo ADMIN_PASSWORD=password
echo API_ADMIN_TOKEN=Basic YWRtaW46cGFzc3dvcmQxMjM=
echo API_ADMIN_USER=admin
echo API_ADMIN_PASSWORD=password123
) > .env
```

Alternatively, create a plain text file named `.env` in the project root and paste in the same values.

### Step 3 — Build the Docker image

```bash
docker build -t playwright-tests .
```

This installs all dependencies and Playwright browsers inside the image. Only needs to run once — or after any dependency changes.

### Step 4 — Run the functional test suite (API + UI)

Visual tests are excluded here with `--grep-invert @visual`, because their baselines are created in a specific image (see [Visual Regression Testing](#-visual-regression-testing)).

**macOS / Linux (Terminal)**

```bash
docker run --rm \
  --shm-size=2gb \
  --env-file .env \
  -v "$(pwd)/allure-results:/app/allure-results" \
  playwright-tests npx playwright test --grep-invert @visual
```

**Windows (PowerShell)**

```powershell
docker run --rm `
  --shm-size=2gb `
  --env-file .env `
  -v "${PWD}/allure-results:/app/allure-results" `
  playwright-tests npx playwright test --grep-invert @visual
```

**Windows (Command Prompt)**

```cmd
docker run --rm --shm-size=2gb --env-file .env -v "%cd%/allure-results:/app/allure-results" playwright-tests npx playwright test --grep-invert @visual
```

> **Why `--shm-size=2gb`?** Playwright browsers use shared memory. Without this flag they can crash inside Docker due to the default 64MB `/dev/shm` limit.
>
> **Why the volume mount?** The `-v` flag maps the `allure-results` folder inside the container back to your local machine so the test results are available after the container exits.

### Step 5 — Run the visual regression tests

Visual tests run in the official Playwright image **v1.58.2-noble**, the same image used to create the Linux baselines and used in CI:

**macOS / Linux (Terminal)**

```bash
docker run --rm --ipc=host \
  -v "$(pwd):/work" -v /work/node_modules -w /work \
  mcr.microsoft.com/playwright:v1.58.2-noble \
  /bin/bash -c "npm ci && npx playwright test --project=visual-chromium --project=visual-mobile-chrome --project=visual-mobile-safari"
```

**Windows (PowerShell)**

```powershell
docker run --rm --ipc=host -v "${PWD}:/work" -v /work/node_modules -w /work mcr.microsoft.com/playwright:v1.58.2-noble /bin/bash -c "npm ci && npx playwright test --project=visual-chromium --project=visual-mobile-chrome --project=visual-mobile-safari"
```

> **Why `-v /work/node_modules`?** It keeps the container's Linux packages separate from your local `node_modules`, so running the container does not break your local setup.

### Step 6 — View the Allure Report

Once tests complete, launch the Allure report in your browser using a Dockerised Allure service — no local Allure installation needed.

**macOS / Linux (Terminal)**

```bash
docker run --rm \
  -p 8080:8080 \
  -v "$(pwd)/allure-results:/app/allure-results" \
  frankescobar/allure-docker-service \
  allure serve allure-results --port 8080 --host 0.0.0.0
```

**Windows (PowerShell)**

```powershell
docker run --rm `
  -p 8080:8080 `
  -v "${PWD}/allure-results:/app/allure-results" `
  frankescobar/allure-docker-service `
  allure serve allure-results --port 8080 --host 0.0.0.0
```

**Windows (Command Prompt)**

```cmd
docker run --rm -p 8080:8080 -v "%cd%/allure-results:/app/allure-results" frankescobar/allure-docker-service allure serve allure-results --port 8080 --host 0.0.0.0
```

Once the terminal shows `Server started`, open your browser and go to:

👉 **http://127.0.0.1:8080**

### Run a specific project or test file

Append Playwright arguments after the image name to override the default command.

**macOS / Linux**

```bash
# API tests only
docker run --rm --shm-size=2gb --env-file .env \
  playwright-tests npx playwright test --project=setup --project=api-tests

# UI tests — Chromium only
docker run --rm --shm-size=2gb --env-file .env \
  playwright-tests npx playwright test --project=ui-chromium

# Single spec file
docker run --rm --shm-size=2gb --env-file .env \
  playwright-tests npx playwright test tests/UI/homepage.spec.ts --project=ui-chromium
```

**Windows (PowerShell)**

```powershell
# API tests only
docker run --rm --shm-size=2gb --env-file .env `
  playwright-tests npx playwright test --project=setup --project=api-tests

# UI tests — Chromium only
docker run --rm --shm-size=2gb --env-file .env `
  playwright-tests npx playwright test --project=ui-chromium

# Single spec file
docker run --rm --shm-size=2gb --env-file .env `
  playwright-tests npx playwright test tests/UI/homepage.spec.ts --project=ui-chromium
```

### What the Dockerfile does

```dockerfile
FROM mcr.microsoft.com/playwright:v1.58.2-jammy  # Official image with browsers pre-installed
WORKDIR /app
COPY package*.json ./
RUN npm install                                    # Install project dependencies
RUN npx playwright install --with-deps             # Install browsers + OS dependencies
COPY . .                                           # Copy source last (layer cache friendly)
CMD ["npx", "playwright", "test"]                  # Default: run the full suite
```

The `.dockerignore` file excludes `node_modules`, test results, reports, and `.env` files to keep the image lean and to ensure local credentials are never baked into the image.

## 🚀 Running Locally (Without Docker)

### Prerequisites

- Node.js (LTS)
- npm

### Installation

```bash
git clone https://github.com/blessybabu-qa/Restful-Booker-Playwright.git
cd Restful-Booker-Playwright

npm install
npx playwright install
```

### Environment Setup

Create a `.env` file in the project root:

```
BASE_URL=https://automationintesting.online
ADMIN_EMAIL=admin
ADMIN_PASSWORD=password
API_URL=https://restful-booker.herokuapp.com
API_ADMIN_TOKEN=Basic YWRtaW46cGFzc3dvcmQxMjM=
API_ADMIN_USER=admin
API_ADMIN_PASSWORD=password123
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run in headed mode (watch the browser)
npx playwright test --headed

# API tests only
npx playwright test --project=setup --project=api-tests

# UI tests only
npx playwright test --project=ui-chromium --project=ui-firefox --project=ui-webkit

# Visual regression tests (desktop + mobile)
npx playwright test --project=visual-chromium --project=visual-mobile-chrome --project=visual-mobile-safari

# Single spec file
npx playwright test tests/UI/booking.spec.ts
```

### View the HTML Report

```bash
npx playwright show-report
```

## 🏗️ Framework Design

### BasePage — Shared Base Class

All page objects extend `BasePage`, which provides shared `navigate`, `waitForPageLoad`, `waitAndFill`, and `waitAndClick` utilities. This avoids duplication and ensures consistent behaviour across all pages.

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

`TestData.ts` uses Faker.js to generate randomised data on every test run — including dynamic future-dated check-in and check-out dates calculated at runtime using `faker.date.soon()`. No hardcoded values anywhere in the test or data layer.

### Data-Driven Testing

The admin login suite uses a data-driven approach powered by `TestData.getAdminLoginScenarios()`. A single loop in `login.spec.ts` iterates over an array of scenarios — each with a username, password, and a valid/invalid flag — and dynamically generates a named test for each one. Adding a new login scenario requires only a new entry in `TestData.ts` with no changes to the spec file needed.

### Environment-Based Configuration

Sensitive credentials and environment-specific URLs are managed via a `.env` file locally and GitHub Actions secrets and variables in CI. This keeps credentials out of source code and allows tests to run against different environments without touching any code.

### Project Separation — API vs UI vs Visual

The Playwright config separates concerns cleanly across eight independent projects:

- **setup** — runs the API health check (`api-ping.spec.ts`) as a standalone gate
- **api-tests** — depends on `setup`; runs all API specs excluding the ping via a negative lookahead regex (`(?!api-ping)`) to prevent the health check running twice
- **ui-chromium, ui-firefox, ui-webkit** — run UI specs independently across all three browser engines with no dependency on the API projects
- **visual-chromium, visual-mobile-chrome, visual-mobile-safari** — run the visual regression suite on a desktop viewport (1280×720), an Android device (Pixel 7) and an iPhone (iPhone 14), each with its own baseline screenshots

This ensures the API, UI and visual suites run in parallel in CI without any cross-dependency.

## 📸 Visual Regression Testing

Functional tests check that a page *works*; visual tests check that it still *looks* right. The visual suite compares screenshots against approved baseline images using Playwright's built-in `toHaveScreenshot()`.

### What is covered

| Check          | Scope            | Devices                              |
| -------------- | ---------------- | ------------------------------------ |
| Home page      | Full page        | Desktop Chromium, Pixel 7, iPhone 14 |
| Navigation bar | Single component | Desktop Chromium, Pixel 7, iPhone 14 |
| Footer         | Single component | Desktop Chromium, Pixel 7, iPhone 14 |

Comparing **individual components** as well as whole pages means a failure points directly at the part of the design that changed, instead of only reporting "the page is different".

### Cross-device testing

Mobile devices are emulated with Playwright's built-in device descriptors (screen size, pixel ratio, touch support and user agent):

```ts
{ name: 'visual-chromium',      testDir: './tests/visual', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 720 } } },
{ name: 'visual-mobile-chrome', testDir: './tests/visual', use: { ...devices['Pixel 7'] } },
{ name: 'visual-mobile-safari', testDir: './tests/visual', use: { ...devices['iPhone 14'] } },
```

Each device gets its own baseline, because the same page legitimately looks different on a phone (for example, a collapsed navigation menu).

### How baselines work

- The first run of a new test creates the baseline image; later runs compare against it.
- A small tolerance (`maxDiffPixelRatio: 0.02`) absorbs tiny anti-aliasing differences without hiding real changes.
- When a test fails, Playwright saves **expected**, **actual** and **diff** images. In CI, these are uploaded as the `visual-diffs` artifact.
- To accept an intentional design change, baselines are regenerated with `--update-snapshots` and reviewed before committing.

### Why baselines are created in Docker

Fonts and anti-aliasing render slightly differently on Windows, macOS and Linux, so a baseline created on a Windows laptop never matches a Linux CI runner pixel for pixel. Baselines are therefore stored per OS (`-win32.png` for local development, `-linux.png` for CI), and the Linux baselines are generated inside the official Playwright image **v1.58.2-noble** — the exact image the CI job uses. Local and CI runs share the same rendering environment, so failures reflect real visual changes rather than environment noise.

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
| Admin Login  | Valid credentials — data-driven                                              | Positive |
| Admin Login  | Invalid random credentials — data-driven                                     | Negative |
| Admin Login  | SQL injection attempt — data-driven                                          | Negative |
| Admin Login  | Empty username — data-driven                                                 | Negative |

### Visual Tests

| Area           | Scenario                                         | Type   |
| -------------- | ------------------------------------------------ | ------ |
| Home page      | Full page matches baseline on desktop and mobile | Visual |
| Navigation bar | Component matches baseline on desktop and mobile | Visual |
| Footer         | Component matches baseline on desktop and mobile | Visual |

### API Tests

| Endpoint            | Scenario                                                | Type     |
| ------------------- | ------------------------------------------------------- | -------- |
| GET /ping           | Service health check returns 201                        | Positive |
| POST /booking       | Create booking, verify ID returned                      | Positive |
| POST /booking       | Returns 400 with completely invalid payload             | Negative |
| POST /booking       | Boundary: totalprice of 0 accepted as valid (free room) | Boundary |
| POST /booking       | Boundary: totalprice of 999999 accepted                 | Boundary |
| POST /booking       | Boundary: totalprice of -1 should return 400 (bug)      | Boundary |
| GET /booking/:id    | Retrieve booking by fixture-generated ID                | Positive |
| GET /booking/:id    | Returns 404 for non-existent booking ID                 | Negative |
| PATCH /booking/:id  | Partial update, verify changed & unchanged fields       | Positive |
| PUT /booking/:id    | Full update with dynamic token and payload              | Positive |
| DELETE /booking/:id | Delete booking, verify 404 on subsequent GET            | Positive |
| DELETE /booking/:id | Returns 403 when no auth token is provided              | Negative |

## 🐛 Bugs Found — API

Three API bugs were discovered during testing and documented as `test.fixme` in `create-booking.spec.ts`. They are intentionally skipped in the pipeline to avoid false failures — the tests exist as living bug reports.

### Bug 1 — Empty `firstname` Accepted as Valid

**Endpoint:** `POST /booking`
**Expected:** `400 Bad Request` — an empty first name should fail validation
**Actual:** `200 OK` — the API accepts the booking and creates it with a blank firstname

### Bug 2 — Missing `firstname` Key Causes a 500 Internal Server Error

**Endpoint:** `POST /booking`
**Expected:** `400 Bad Request` — a missing required field should return a clear validation error
**Actual:** `500 Internal Server Error` — the server crashes when the `firstname` key is omitted entirely

### Bug 3 — Negative `totalprice` Accepted as Valid

**Endpoint:** `POST /booking`
**Expected:** `400 Bad Request` — a negative price is not a meaningful value for a booking and should be rejected
**Actual:** `200 OK` — the API accepts the booking with `totalprice: -1` without any validation error

Bugs 1 and 2 point to missing input validation on required string fields. Bug 3 was uncovered through boundary testing of the `totalprice` field — the same boundary suite confirmed that `0` and `999999` are accepted, which is reasonable, but a negative value slipping through indicates no lower-bound guard exists on the field.

## 📊 Test Reports

### Allure Report — Live on Firebase

An Allure report is automatically generated on every CI run and deployed to Firebase Hosting. It combines the API, UI and visual test results.

🔗 **[View Latest Allure Report](https://restful-booker-qa.web.app)**

The report provides:

- Full test suite breakdown by feature and spec file
- Pass/fail status per test with step-level detail
- Timeline view across parallel browser runs
- History and trend tracking across builds

## ⚙️ CI/CD

Tests run automatically on every push and pull request to `main` via GitHub Actions. The pipeline is split into four jobs:

1. **Backend: API Suite** — runs the `setup` and `api-tests` projects
2. **Frontend: UI Suite** — runs `ui-chromium`, `ui-firefox`, and `ui-webkit`
3. **Frontend: Visual Regression** — runs the three visual projects inside the `mcr.microsoft.com/playwright:v1.58.2-noble` container, so screenshots are rendered in exactly the same environment as the baselines; on failure, the expected/actual/diff images are uploaded as an artifact
4. **Deploy Allure to Firebase** — combines results from all three test jobs and publishes them to Firebase Hosting

The three test jobs run in parallel, so a visual change, a broken UI flow or an API regression each shows up as its own failing check.

A separate `docker-tests.yml` workflow is available for manual dispatch. It builds the Docker image, runs the functional suite (API + UI, excluding `@visual`) inside the container, and uploads the Allure results as a build artifact.

### Required GitHub Secrets & Variables

| Name                                    | Type     | Description                                           |
| --------------------------------------- | -------- | ----------------------------------------------------- |
| ADMIN_EMAIL                             | Secret   | Admin login email for UI tests                        |
| ADMIN_PASSWORD                          | Secret   | Admin login password for UI tests                     |
| API_ADMIN_TOKEN                         | Secret   | Basic auth token for PATCH endpoint authentication       |
| API_ADMIN_USER                          | Secret   | Username for API token generation (PUT/DELETE)        |
| API_ADMIN_PASSWORD                      | Secret   | Password for API token generation (PUT/DELETE)        |
| FIREBASE_SERVICE_ACCOUNT_RESTFUL_BOOKER | Secret   | Firebase deployment credentials                       |
| BASE_URL                                | Variable | UI target environment URL (also used by visual tests) |
| API_URL                                 | Variable | API target environment URL                            |

## 🧩 Technical Challenges & Solutions

### Challenge 1: Booking a Room Without Knowing Which Dates Are Free

The booking calendar renders a live React Big Calendar populated with real reservations from a shared demo site. Hardcoding a date range worked locally but failed in CI because another user had already booked those dates. The solution was a dynamic date-picker that scans the visible calendar grid at runtime, checks each cell for an existing booking marker, and finds the first consecutive free pair. If the current month is fully booked, it navigates forward up to five months ahead. API booking dates are similarly generated dynamically at runtime using `faker.date.soon()` with a `refDate` to guarantee check-out always falls after check-in.

### Challenge 2: Third-Party Server Instability

The target site occasionally throws an application error mid-test. Rather than letting the test fail with a misleading assertion error, the booking success check detects the error page first and returns early. The spec marks the test as skipped with a clear explanation, keeping the suite clean for genuine failures.

### Challenge 3: API Authentication — Two Methods, One Codebase

The API supports Bearer token authentication for PATCH and session cookie authentication for PUT and DELETE. Authentication strategy is split by HTTP method in `BookingService.ts` — the `patchBooking` method reads the bearer token from `API_ADMIN_TOKEN` in the environment, while `updateBooking` and `deleteBooking` accept a dynamic session token generated fresh per test via the `authToken` fixture. Token creation reads credentials from `API_ADMIN_USER` and `API_ADMIN_PASSWORD` environment variables and throws a descriptive error immediately if the auth endpoint returns a non-OK response.

### Challenge 4: Preventing Silent Credential Failures in Data-Driven Tests

If a CI secret is not configured, the positive login scenario silently receives `undefined` and attempts to log in with the literal string `"undefined"`. An explicit guard in `loginAsAdmin()` throws a descriptive error immediately if either credential resolves to `undefined`, surfacing misconfiguration at the point of failure rather than producing a misleading assertion error.

### Challenge 5: API Tests Depending on Pre-Existing Data

Several API tests need a booking to exist before the test body runs. The `preCreatedBookingId` fixture handles creation before the test runs and exposes only the resulting ID. The `authToken` fixture similarly generates a fresh token per test. Both are composed in `fixtures.ts` using Playwright's fixture dependency graph.

### Challenge 6: Preventing the Health Check Running Twice

The `setup` project matches `api-ping.spec.ts` by exact filename. Without a guard, the `api-tests` project glob (`tests/api/*.spec.ts`) would also match and run it a second time. A negative lookahead regex (`(?!api-ping)`) in the `api-tests` `testMatch` pattern explicitly excludes the ping spec, ensuring it runs exactly once as a dependency gate and never again as part of the main API suite.

### Challenge 7: Screenshots That Differ Between Operating Systems

The first visual baselines were created on Windows, but the CI runner is Linux, where fonts render slightly differently — so identical pages produced "different" screenshots. Generating the Linux baselines inside the official Playwright Docker image, and running the CI visual job in that same image, removed the environment from the equation. The `node_modules` folder is mounted as a separate volume during baseline generation, so the container's Linux packages never overwrite the local Windows installation.

### Challenge 8: Keeping Visual Tests Out of the Wrong Environment

The main Dockerfile is based on a different image than the visual baselines, so running visual tests there would produce false failures. Visual tests are tagged `@visual` and excluded from the Docker suite with `--grep-invert @visual`; they run only in their dedicated CI job.

## 🤖 How I Used AI in This Project

I used AI as a pairing tool at specific points where the problem was well-defined but the solution required specialist knowledge I did not have on hand.

The calendar drag implementation was the most significant case. React Big Calendar uses synthetic drag events and a standard drag-and-drop sequence does not trigger date selection. I used AI to understand the correct mouse event sequence and coordinate maths for targeting cell centres using bounding box data. The dynamic availability-scanning logic that wraps the drag was written independently.

The XPath traversal used to detect existing bookings on a day cell also involved AI guidance, as the booking event element sits as a sibling in the DOM rather than a direct child of the day cell.

AI was involved throughout the project in this way: I made the architectural and design decisions myself — what pattern to use, why, and how the pieces should fit together — and used AI to help generate the implementation, work through Playwright-specific syntax, and troubleshoot issues along the way.

## 📚 What I Learned

- **Framework design matters more than test count.** Refactoring everything into POManager and fixtures was time-consuming but made every subsequent test faster to build and easier to debug.
- **Fixtures are a first-class design tool.** Treating pre-created booking IDs and auth tokens as fixtures rather than in-test setup changed how I think about test isolation.
- **Data-driven testing scales better than duplicated specs.** The login suite started as separate test cases. Refactoring it into a data-driven loop made adding new scenarios trivial without touching the spec file.
- **Shared environments will break your tests in creative ways.** Tests that discover their own preconditions at runtime are the only reliable solution when you do not control the environment.
- **Visual tests are only as reliable as their environment.** A pixel comparison is meaningless if the baseline and the test run render fonts differently — pinning the rendering environment is part of the test design.
- **CI is not optional.** Running tests only locally, usually on one browser, can hide flakiness that only shows up under different conditions. Setting up GitHub Actions early meant issues were surfaced automatically on every push, rather than relying on remembering to test manually across browsers.

## 📌 Notes

- This project targets automationintesting.online, a public shared demo environment that occasionally returns server errors. Booking tests handle this gracefully by skipping rather than failing.
- Because the demo site is shared and live, its content can change. If a visual test fails, check the diff image to decide whether it is an unexpected regression or an intended content change, and update the baselines only in the second case.
- Test coverage is intentionally scoped to selected user journeys. The framework is designed to be extended incrementally.

## 🔭 Planned Improvements

- [ ] Add negative UI test cases with invalid data variants (invalid email format, phone number too short, special characters in name fields)
- [ ] Extend visual coverage to the room, booking and contact pages
- [ ] Add tablet viewports to the visual device matrix
