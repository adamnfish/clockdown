// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Timer Functionality', () => {
  test('should start timer when player clicks their start button', async ({ page }) => {
    await page.goto('/');
    await page.click('#start-button');
    
    // Click on the first player to start their timer
    await page.click('#player-0');
    
    // Player 0 should no longer have "thinking" class and should show timer
    await expect(page.locator('#player-0')).not.toHaveClass(/thinking/);
    
    // Other players should still be in thinking state
    await expect(page.locator('#player-1')).toHaveClass(/thinking/);
    
    // Wait a moment and check that timer is counting
    await page.waitForTimeout(1100); // Wait just over 1 second
    
    // Player 0 should show at least 1 second
    const timerText = await page.locator('#player-0').textContent();
    expect(timerText).toMatch(/[1-9]\d*"/); // Should show 1" or higher
  });

  test('should count timer correctly in seconds', async ({ page }) => {
    await page.goto('/');
    await page.click('#start-button');
    
    // Start timer for player 0
    await page.click('#player-0');
    
    // Check initial state (should be 0" or close to it)
    await expect(page.locator('#player-0')).toHaveText(/0"/);
    
    // Wait for about 2.1 seconds and check timer
    await page.waitForTimeout(2100);
    
    const timerText = await page.locator('#player-0').textContent();
    // Should show 2" (2 seconds) - allowing for some timing variance
    expect(parseInt(timerText.replace('"', ''))).toBeGreaterThanOrEqual(2);
    expect(parseInt(timerText.replace('"', ''))).toBeLessThanOrEqual(3);
  });

  test('should pass timer to next player when active player is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('#start-button');
    
    // Start timer for player 0
    await page.click('#player-0');
    
    // Wait a moment for timer to accumulate some time
    await page.waitForTimeout(1100);
    
    // Click player 0 again to pass to next player
    await page.click('#player-0');
    
    // Player 0 should now be in thinking state with accumulated time
    await expect(page.locator('#player-0')).toHaveClass(/thinking/);
    
    // Player 1 should now be active (not thinking)
    await expect(page.locator('#player-1')).not.toHaveClass(/thinking/);
    
    // Player 0 should show the accumulated time (at least 1 second)
    const player0Time = await page.locator('#player-0').textContent();
    expect(parseInt(player0Time.replace('"', ''))).toBeGreaterThanOrEqual(1);
  });

  test('should cycle through players correctly', async ({ page }) => {
    await page.goto('/');
    
    // Add one more player to test cycling through 3 players
    await page.click('#add-player-button');
    await page.click('#start-button');
    
    // Start with player 0
    await page.click('#player-0');
    await page.waitForTimeout(500);
    
    // Pass to player 1
    await page.click('#player-0');
    await expect(page.locator('#player-1')).not.toHaveClass(/thinking/);
    await page.waitForTimeout(500);
    
    // Pass to player 2
    await page.click('#player-1');
    await expect(page.locator('#player-2')).not.toHaveClass(/thinking/);
    await page.waitForTimeout(500);
    
    // Pass back to player 0 (cycling)
    await page.click('#player-2');
    await expect(page.locator('#player-0')).not.toHaveClass(/thinking/);
    
    // All players should have some accumulated time
    for (let i = 0; i < 3; i++) {
      if (i !== 0) { // Player 0 is currently active
        const playerTime = await page.locator(`#player-${i}`).textContent();
        expect(parseInt(playerTime.replace('"', ''))).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should pause and resume timers correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('#start-button');
    
    // Start timer for player 0
    await page.click('#player-0');
    await page.waitForTimeout(1100);
    
    // Pause the game
    await page.click('#pause-button');
    
    // Pause button should show "Resume"
    await expect(page.locator('#pause-button')).toHaveText('Resume');
    await expect(page.locator('#pause-button')).toHaveClass(/paused/);
    
    // Player sections should show paused state
    await expect(page.locator('#player-0')).toHaveClass(/paused/);
    
    // Get current time and wait
    const pausedTime = await page.locator('#player-0').textContent();
    await page.waitForTimeout(1000);
    
    // Time should not have changed while paused
    const stillPausedTime = await page.locator('#player-0').textContent();
    expect(pausedTime).toBe(stillPausedTime);
    
    // Resume the game
    await page.click('#pause-button');
    
    // Button should show "Pause" again
    await expect(page.locator('#pause-button')).toHaveText('Pause');
    await expect(page.locator('#pause-button')).not.toHaveClass(/paused/);
    
    // Player sections should not show paused state
    await expect(page.locator('#player-0')).not.toHaveClass(/paused/);
    
    // Timer should continue counting from where it left off
    await page.waitForTimeout(1100);
    const resumedTime = await page.locator('#player-0').textContent();
    expect(parseInt(resumedTime.replace('"', ''))).toBeGreaterThan(parseInt(pausedTime.replace('"', '')));
  });
});