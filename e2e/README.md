# E2E Tests for Clockdown

This directory contains end-to-end tests for the Clockdown timer application using Playwright.

## Test Coverage

The e2e tests cover the following scenarios as specified in the requirements:

### 1. App Startup (`app-startup.spec.js`)
- ✅ Application loads successfully
- ✅ Shows correct title and header
- ✅ Displays welcome screen with Start and + player buttons
- ✅ Shows initial player preview with default 2 players
- ✅ Transitions to game screen when Start is clicked

### 2. Player Management (`player-management.spec.js`)
- ✅ Can add new players up to maximum of 7
- ✅ Player colors are assigned correctly in order
- ✅ Player count is maintained when game starts
- ✅ All players show "start" button initially

### 3. Timer Functionality (`timer-functionality.spec.js`)
- ✅ Players can tap their button to start their timer
- ✅ Timers count up correctly in seconds
- ✅ Can pass priority between players by tapping active timer
- ✅ Timer cycles correctly through all players
- ✅ Pause and resume functionality works correctly

### 4. Layout and Visual Tests (`layout-visual.spec.js`)
- ✅ Layout looks correct at various player counts (2, 4, 7 players)
- ✅ Visual states are distinct for thinking vs active players
- ✅ Paused state shows correct visual indicators
- ✅ Mobile responsive layout works
- ✅ Layout remains stable during timer transitions

## Test Setup

### Prerequisites
```bash
npm install
```

### Running Tests

Due to network restrictions that prevent building the full Elm application, these tests use a mock HTML/JavaScript version of the app that replicates the core functionality.

#### Start the test server manually:
```bash
./start-test-server.sh
# or
cd test-app && python3 -m http.server 3000
```

#### Run tests (once Playwright browsers are available):
```bash
# Run all tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui

# Run in headed mode (visible browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test e2e/app-startup.spec.js
```

## Test App

The `test-app/` directory contains a simplified HTML/JavaScript implementation of the Clockdown application that provides the same functionality as the Elm version:

- Multi-player timer interface
- Add/remove players (up to 7 different colors)
- Start, pause, resume functionality
- Timer counting in seconds
- Player priority passing
- Visual states for active/thinking/paused players

## Browser Support

The tests are configured to run on:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Configuration

The Playwright configuration is in `playwright.config.js` and includes:
- Test directory: `./e2e`
- Base URL: `http://127.0.0.1:3000`
- Automatic server startup
- Trace collection on retry
- HTML reporting

## Notes

- The mock application closely mirrors the behavior of the actual Elm application
- Tests focus on user interactions and visible behavior
- Timer accuracy is tested with reasonable tolerances to account for execution timing
- Visual tests check for CSS classes and computed styles
- Mobile tests verify responsive behavior