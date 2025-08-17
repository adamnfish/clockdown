// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Timer Functionality', () => {
  test('should start timer when player clicks their start button', async ({ page }) => {
    await page.goto('/');
    await page.click('text="Start"');
    
    // Click on the first player (red) start button to start their timer
    await page.click('#player-red');
    
    // Red player should now show timer, blue player should show 0
    await page.waitForTimeout(100); // Brief wait for timer to appear
    await expect(page.locator('#player-blue')).toContainText('0"'); // Blue player inactive
    
    // Should have a Pause button visible
    await expect(page.locator('text="Pause"')).toBeVisible();
    
    // Wait a moment and check that timer is counting
    await page.waitForTimeout(1100); // Wait just over 1 second
    
    // Red player should show at least 1 second
    const redPlayerText = await page.locator('#player-red').textContent();
    expect(parseInt(redPlayerText.replace('"', ''))).toBeGreaterThanOrEqual(1);
  });

  test('should count timer correctly in seconds', async ({ page }) => {
    await page.goto('/');
    await page.click('text="Start"');
    
    // Start timer for first player (red)
    await page.click('#player-red');
    
    // Check that blue player shows 0 and red player will count up
    await expect(page.locator('#player-blue')).toContainText('0"');
    
    // Wait for about 2.1 seconds and check timer
    await page.waitForTimeout(2100);
    
    // Red player should show 2" (2 seconds)
    const redPlayerText = await page.locator('#player-red').textContent();
    const seconds = parseInt(redPlayerText.replace('"', ''));
    expect(seconds).toBeGreaterThanOrEqual(2);
    expect(seconds).toBeLessThanOrEqual(3);
  });

  test('should pass timer to next player when active player is clicked', async ({ page }) => {
    await page.goto('/');
    await page.click('text="Start"');
    
    // Start timer for first player (red)
    await page.click('#player-red');
    
    // Wait a moment for timer to accumulate some time
    await page.waitForTimeout(1100);
    
    // Click the active red player to pass to next player
    await page.click('#player-red');
    
    // Red player should now show accumulated time, blue should be active
    const redPlayerText = await page.locator('#player-red').textContent();
    expect(parseInt(redPlayerText.replace('"', ''))).toBeGreaterThanOrEqual(1);
    
    // Blue player should now be active
    await page.waitForTimeout(1100);
    // Blue player should no not be showing 0 seconds
    const bluePlayerText = await page.locator('#player-blue').textContent();
    expect(bluePlayerText).not.toBe('0"');
  });

  test('should cycle through players correctly', async ({ page }) => {
    await page.goto('/');
    
    // Add one more player to test cycling through 3 players
    await page.click('text="+ player"');
    await page.click('text="Start"');
    
    // Should have 3 start buttons initially
    await expect(page.locator('text="start"')).toHaveCount(3);
    
    // Start with red player
    await page.click('#player-red');
    await page.waitForTimeout(1100);
    
    // Blue and green should show 0", red should show time
    await expect(page.locator('#player-blue')).toContainText('0"');
    await expect(page.locator('#player-green')).toContainText('0"');
    
    // Pass to next player by clicking red
    await page.click('#player-red');
    await page.waitForTimeout(1100);
    
    // Red should maintain time, blue should be active, green still 0
    const redTime = await page.locator('#player-red').textContent();
    expect(parseInt(redTime.replace('"', ''))).toBeGreaterThan(0);
    await expect(page.locator('#player-green')).toContainText('0"');
  });

  test('should pause and resume timers correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text="Start"');
    
    // Start timer for first player (red)
    await page.click('#player-red');
    await page.waitForTimeout(1100);
    
    // Pause the game
    await page.click('text="Pause"');
    
    // Pause button should show "Resume"
    await expect(page.locator('text="Resume"')).toBeVisible();
    
    // Get current time from red player and wait
    const pausedTime = await page.locator('#player-red').textContent();
    await page.waitForTimeout(1000);
    
    // Time should not have changed while paused
    const stillPausedTime = await page.locator('#player-red').textContent();
    expect(pausedTime).toBe(stillPausedTime);
    
    // Resume the game
    await page.click('text="Resume"');
    
    // Button should show "Pause" again
    await expect(page.locator('text="Pause"')).toBeVisible();
    
    // Timer should continue counting from where it left off
    await page.waitForTimeout(1100);
    const resumedTime = await page.locator('#player-red').textContent();
    expect(parseInt(resumedTime.replace('"', ''))).toBeGreaterThan(parseInt(pausedTime.replace('"', '')));
  });
});