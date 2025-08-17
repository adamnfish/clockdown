// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Layout and Visual Tests', () => {
  test('should display correct layout for 2 players', async ({ page }) => {
    await page.goto('/');
    await page.click('#start-button');
    
    // Check that we have 2 player sections
    const playerSections = page.locator('.player-section');
    await expect(playerSections).toHaveCount(2);
    
    // Check that each player section is visible and has proper styling
    for (let i = 0; i < 2; i++) {
      await expect(playerSections.nth(i)).toBeVisible();
      await expect(playerSections.nth(i)).toHaveCSS('display', 'flex');
    }
    
    // Check that the players container uses flexbox layout
    await expect(page.locator('#players-game')).toHaveCSS('display', 'flex');
    await expect(page.locator('#players-game')).toHaveCSS('flex-direction', 'column');
  });

  test('should display correct layout for 4 players', async ({ page }) => {
    await page.goto('/');
    
    // Add 2 more players for a total of 4
    await page.click('#add-player-button');
    await page.click('#add-player-button');
    await page.click('#start-button');
    
    // Check that we have 4 player sections
    const playerSections = page.locator('.player-section');
    await expect(playerSections).toHaveCount(4);
    
    // Each section should be visible and properly sized
    for (let i = 0; i < 4; i++) {
      await expect(playerSections.nth(i)).toBeVisible();
      
      // Check that each player has the correct color class
      const expectedColors = ['red', 'blue', 'green', 'yellow'];
      await expect(playerSections.nth(i)).toHaveClass(new RegExp(`player-${expectedColors[i]}`));
    }
  });

  test('should display correct layout for maximum players (7)', async ({ page }) => {
    await page.goto('/');
    
    // Add players to reach maximum of 7
    for (let i = 0; i < 5; i++) {
      await page.click('#add-player-button');
    }
    await page.click('#start-button');
    
    // Check that we have 7 player sections
    const playerSections = page.locator('.player-section');
    await expect(playerSections).toHaveCount(7);
    
    // All sections should be visible
    for (let i = 0; i < 7; i++) {
      await expect(playerSections.nth(i)).toBeVisible();
    }
    
    // Check that colors are correctly assigned
    const expectedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'brown'];
    for (let i = 0; i < 7; i++) {
      await expect(playerSections.nth(i)).toHaveClass(new RegExp(`player-${expectedColors[i]}`));
    }
  });

  test('should show distinct visual states for thinking vs active players', async ({ page }) => {
    await page.goto('/');
    await page.click('#start-button');
    
    // Initially all players should be in thinking state
    const playerSections = page.locator('.player-section');
    await expect(playerSections.nth(0)).toHaveClass(/thinking/);
    await expect(playerSections.nth(1)).toHaveClass(/thinking/);
    
    // Start player 0's timer
    await page.click('#player-0');
    
    // Player 0 should no longer have thinking class
    await expect(playerSections.nth(0)).not.toHaveClass(/thinking/);
    
    // Player 1 should still have thinking class
    await expect(playerSections.nth(1)).toHaveClass(/thinking/);
    
    // Check visual differences in font size
    const activePlayerFontSize = await playerSections.nth(0).evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    const thinkingPlayerFontSize = await playerSections.nth(1).evaluate(el => 
      window.getComputedStyle(el).fontSize
    );
    
    // Active player should have larger font size (40px vs 30px)
    expect(parseFloat(activePlayerFontSize)).toBeGreaterThan(parseFloat(thinkingPlayerFontSize));
  });

  test('should show paused visual state correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('#start-button');
    
    // Start a timer and then pause
    await page.click('#player-0');
    await page.waitForTimeout(500);
    await page.click('#pause-button');
    
    // All player sections should have paused class
    const playerSections = page.locator('.player-section');
    await expect(playerSections.nth(0)).toHaveClass(/paused/);
    await expect(playerSections.nth(1)).toHaveClass(/paused/);
    
    // Pause button should have paused styling
    await expect(page.locator('#pause-button')).toHaveClass(/paused/);
    
    // Resume and check that paused classes are removed
    await page.click('#pause-button');
    await expect(playerSections.nth(0)).not.toHaveClass(/paused/);
    await expect(playerSections.nth(1)).not.toHaveClass(/paused/);
    await expect(page.locator('#pause-button')).not.toHaveClass(/paused/);
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Add a few players and start
    await page.click('#add-player-button');
    await page.click('#start-button');
    
    // Check that all elements are still visible and functional on mobile
    const playerSections = page.locator('.player-section');
    await expect(playerSections).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      await expect(playerSections.nth(i)).toBeVisible();
    }
    
    // Control buttons should be visible
    await expect(page.locator('#pause-button')).toBeVisible();
    
    // Start a timer to test interaction on mobile
    await page.click('#player-0');
    await expect(playerSections.nth(0)).not.toHaveClass(/thinking/);
  });

  test('should maintain layout integrity during timer transitions', async ({ page }) => {
    await page.goto('/');
    
    // Add players for more complex layout
    await page.click('#add-player-button');
    await page.click('#add-player-button');
    await page.click('#start-button');
    
    // Get initial layout measurements
    const playersContainer = page.locator('#players-game');
    const initialHeight = await playersContainer.evaluate(el => el.offsetHeight);
    
    // Start timer and transition between players
    await page.click('#player-0');
    await page.waitForTimeout(300);
    await page.click('#player-0'); // Pass to player 1
    await page.waitForTimeout(300);
    await page.click('#player-1'); // Pass to player 2
    
    // Layout should remain stable
    const finalHeight = await playersContainer.evaluate(el => el.offsetHeight);
    expect(Math.abs(finalHeight - initialHeight)).toBeLessThan(5); // Allow small variance
    
    // All players should still be visible
    const playerSections = page.locator('.player-section');
    for (let i = 0; i < 4; i++) {
      await expect(playerSections.nth(i)).toBeVisible();
    }
  });
});