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
npx playwright install
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
- Base URL: `http://127.0.0.1:1234`
- Automatic server startup
- Trace collection on retry
- HTML reporting
- Screenshots on failure

## Notes

- Tests focus on user interactions and visible behavior
- Timer accuracy is tested with reasonable tolerances to account for execution timing
- Mobile tests verify responsive behavior
