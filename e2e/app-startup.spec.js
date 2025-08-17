// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Clockdown App Startup', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads and has the correct title
    await expect(page).toHaveTitle('Clockdown');
    
    // Check that the main header is visible
    await expect(page.locator('.header .title')).toHaveText('Clockdown');
    
    // Check that we're on the welcome screen
    await expect(page.locator('#welcome-screen')).toBeVisible();
    
    // Check that the start and add player buttons are present
    await expect(page.locator('#start-button')).toBeVisible();
    await expect(page.locator('#start-button')).toHaveText('Start');
    
    await expect(page.locator('#add-player-button')).toBeVisible();
    await expect(page.locator('#add-player-button')).toHaveText('+ player');
  });

  test('should show initial player preview with default 2 players', async ({ page }) => {
    await page.goto('/');
    
    // Check that there are exactly 2 player previews initially
    const playerPreviews = page.locator('.player-preview');
    await expect(playerPreviews).toHaveCount(2);
    
    // Check that the first player is red and second is blue
    await expect(playerPreviews.nth(0)).toHaveClass(/player-red/);
    await expect(playerPreviews.nth(1)).toHaveClass(/player-blue/);
  });

  test('should start the game when Start button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the start button
    await page.click('#start-button');
    
    // Welcome screen should be hidden
    await expect(page.locator('#welcome-screen')).toBeHidden();
    
    // Clock screen should be visible
    await expect(page.locator('#clock-screen')).toBeVisible();
    
    // Game controls should be present
    await expect(page.locator('#pause-button')).toBeVisible();
    await expect(page.locator('#pause-button')).toHaveText('Pause');
    
    // Player sections should be present
    const playerSections = page.locator('.player-section');
    await expect(playerSections).toHaveCount(2);
  });
});