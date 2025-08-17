// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Player Management', () => {
  test('should add new players when + player button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Initially should have 2 players
    await expect(page.locator('.player-preview')).toHaveCount(2);
    
    // Add a third player
    await page.click('#add-player-button');
    await expect(page.locator('.player-preview')).toHaveCount(3);
    await expect(page.locator('.player-preview').nth(2)).toHaveClass(/player-green/);
    
    // Add a fourth player
    await page.click('#add-player-button');
    await expect(page.locator('.player-preview')).toHaveCount(4);
    await expect(page.locator('.player-preview').nth(3)).toHaveClass(/player-yellow/);
    
    // Add more players up to the limit
    await page.click('#add-player-button'); // Purple
    await page.click('#add-player-button'); // Orange
    await page.click('#add-player-button'); // Brown
    await expect(page.locator('.player-preview')).toHaveCount(7);
    
    // Should not add more than 7 players
    await page.click('#add-player-button');
    await expect(page.locator('.player-preview')).toHaveCount(7);
  });

  test('should correctly display player colors in order', async ({ page }) => {
    await page.goto('/');
    
    // Add players and verify colors
    const expectedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'brown'];
    
    // Add all possible players
    for (let i = 2; i < expectedColors.length; i++) {
      await page.click('#add-player-button');
    }
    
    // Verify all player colors are correct
    for (let i = 0; i < expectedColors.length; i++) {
      await expect(page.locator('.player-preview').nth(i)).toHaveClass(new RegExp(`player-${expectedColors[i]}`));
    }
  });

  test('should maintain player count when game starts', async ({ page }) => {
    await page.goto('/');
    
    // Add extra players
    await page.click('#add-player-button'); // 3 players
    await page.click('#add-player-button'); // 4 players
    
    // Start the game
    await page.click('#start-button');
    
    // Check that we have 4 player sections in the game
    await expect(page.locator('.player-section')).toHaveCount(4);
    
    // Check that colors are preserved
    await expect(page.locator('.player-section').nth(0)).toHaveClass(/player-red/);
    await expect(page.locator('.player-section').nth(1)).toHaveClass(/player-blue/);
    await expect(page.locator('.player-section').nth(2)).toHaveClass(/player-green/);
    await expect(page.locator('.player-section').nth(3)).toHaveClass(/player-yellow/);
  });

  test('should show start buttons for all players initially', async ({ page }) => {
    await page.goto('/');
    
    // Add one more player for variety
    await page.click('#add-player-button');
    
    // Start the game
    await page.click('#start-button');
    
    // All players should be in "thinking" state with "start" text
    const playerSections = page.locator('.player-section');
    await expect(playerSections).toHaveCount(3);
    
    for (let i = 0; i < 3; i++) {
      await expect(playerSections.nth(i)).toHaveClass(/thinking/);
      await expect(playerSections.nth(i)).toHaveText('start');
    }
  });
});