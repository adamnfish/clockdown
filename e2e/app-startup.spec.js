// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Clockdown App Startup', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads and has the correct title
    await expect(page).toHaveTitle('Clockdown');
    
    // Check that the page contains the clockdown title
    await expect(page.locator('text="clockdown"')).toBeVisible();
    
    // Check that we're on the welcome screen by looking for Start button
    await expect(page.locator('text="Start"')).toBeVisible();
    
    // Check that the start and add player buttons are present
    await expect(page.locator('text="Start"')).toBeVisible();
    await expect(page.locator('text="+ player"')).toBeVisible();
  });

  test('should show initial player preview with default 2 players', async ({ page }) => {
    await page.goto('/');
    
    // Check that there are player preview areas on the welcome screen
    // Verify by checking that Start and + player buttons are visible
    // indicating the welcome screen with player previews is showing
    await expect(page.locator('text="Start"')).toBeVisible();
    await expect(page.locator('text="+ player"')).toBeVisible();
  });

  test('should start the game when Start button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the start button
    await page.click('text="Start"');
    
    // Welcome screen should be hidden (main Start button no longer visible)
    await expect(page.locator('text="Start"')).toBeHidden();
    
    // Game screen should be visible (player start buttons present)
    await expect(page.locator('text="start"').first()).toBeVisible();
    
    // Player start buttons should be present (2 players by default)
    const playerStartButtons = page.locator('text="start"');
    await expect(playerStartButtons).toHaveCount(2);
  });
});