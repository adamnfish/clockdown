// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Player Management', () => {
  test('should add new players when + player button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Initially should have 2 players (check via text=start count after starting game)
    await page.click('text="Start"');
    await expect(page.locator('text="start"')).toHaveCount(2);
    
    // Go back to test adding players
    await page.goto('/');  // Reset to welcome screen
    
    // Add a third player
    await page.click('text="+ player"');
    // Verify by starting game and checking player count
    await page.click('text="Start"');
    await expect(page.locator('text="start"')).toHaveCount(3);
    
    // Go back to continue testing
    await page.goto('/');
    
    // Add players to test the limit
    await page.click('text="+ player"'); // 3rd player
    await page.click('text="+ player"'); // 4th player
    
    // Add more players up to the limit
    await page.click('text="+ player"'); // 5th
    await page.click('text="+ player"'); // 6th  
    await page.click('text="+ player"'); // 7th
    await page.click('text="+ player"'); // 8th

    // Verify we have 8 players by starting game
    await page.click('text="Start"');
    await expect(page.locator('text="start"')).toHaveCount(8);
  });

  test('should correctly add up to 8 players', async ({ page }) => {
    await page.goto('/');
    
    // Add all possible players (6 more to reach 8 total after initial 2)
    for (let i = 0; i < 6; i++) {
      await page.click('text="+ player"');
    }
    
    // Verify we can start a game with 8 players
    await page.click('text="Start"');
    await expect(page.locator('text="start"')).toHaveCount(8);
  });

  test('should maintain player count when game starts', async ({ page }) => {
    await page.goto('/');
    
    // Add extra players
    await page.click('text="+ player"'); // 3 players
    await page.click('text="+ player"'); // 4 players
    
    // Start the game
    await page.click('text="Start"');
    
    // Check that we have 4 player start buttons in the game
    await expect(page.locator('text="start"')).toHaveCount(4);
  });

  test('should show start buttons for all players initially', async ({ page }) => {
    await page.goto('/');
    
    // Add one more player for variety
    await page.click('text="+ player"');
    
    // Start the game
    await page.click('text="Start"');
    
    // All players should show "start" text initially
    await expect(page.locator('text="start"')).toHaveCount(3);
    
    // Start first player to activate timer mode
    await page.click('#player-red');
    
    // Should now have red player active, others at 0
    await expect(page.locator('#player-blue')).toContainText('0"');
    await expect(page.locator('#player-green')).toContainText('0"');
  });
});