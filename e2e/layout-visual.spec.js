// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Layout and Visual Tests', () => {
  test('should display correct layout for 2 players', async ({ page }) => {
    await page.goto('/');
    await page.click('text="Start"');
    
    // Should have 2 start buttons initially
    await expect(page.locator('text="start"')).toHaveCount(2);
    
    // Start the first player to activate timer mode
    await page.click('#player-red');
    
    // Should now have timer displays instead
    await expect(page.locator('#player-blue')).toContainText('0"'); // Inactive player
    
    // Check that both players are visible
    await expect(page.locator('#player-red')).toBeVisible();
    await expect(page.locator('#player-blue')).toBeVisible();
  });

  test('should display correct layout for 4 players', async ({ page }) => {
    await page.goto('/');
    
    // Add 2 more players for a total of 4
    await page.click('text="+ player"');
    await page.click('text="+ player"');
    await page.click('text="Start"');
    
    // Should have 4 start buttons initially
    await expect(page.locator('text="start"')).toHaveCount(4);
    
    // Start the first player to activate timer mode
    await page.click('#player-red');
    
    // Should now have timer displays
    await expect(page.locator('#player-red')).not.toContainText('0"'); // Red player active
    await expect(page.locator('#player-blue')).toContainText('0"'); // Others inactive
    
    // All 4 players should be visible
    await expect(page.locator('#player-red')).toBeVisible();
    await expect(page.locator('#player-blue')).toBeVisible();
    await expect(page.locator('#player-green')).toBeVisible();
    await expect(page.locator('#player-yellow')).toBeVisible();
  });

  test('should display correct layout for maximum players (7)', async ({ page }) => {
    await page.goto('/');
    
    // Add players to reach maximum of 7
    for (let i = 0; i < 5; i++) {
      await page.click('text="+ player"');
    }
    await page.click('text="Start"');
    
    // Should have 7 start buttons initially
    await expect(page.locator('text="start"')).toHaveCount(7);
    
    // Start the first player to activate timer mode
    await page.click('#player-red');
    
    // Should now have timer displays
    await expect(page.locator('#player-red')).not.toContainText('0"'); // Red player active
    await expect(page.locator('#player-blue')).toContainText('0"'); // Others inactive
    
    // All 7 players should be visible
    await expect(page.locator('#player-red')).toBeVisible();
    await expect(page.locator('#player-blue')).toBeVisible();
    await expect(page.locator('#player-green')).toBeVisible();
    await expect(page.locator('#player-yellow')).toBeVisible();
    await expect(page.locator('#player-purple')).toBeVisible();
    await expect(page.locator('#player-orange')).toBeVisible();
    await expect(page.locator('#player-brown')).toBeVisible();
  });

  test('should show distinct visual states for thinking vs active players', async ({ page }) => {
    await page.goto('/');
    await page.click('text="Start"');
    
    // Initially all players should show "start" text
    await expect(page.locator('text="start"')).toHaveCount(2);
    
    // Start first player's timer
    await page.click('#player-red');
    
    // Should now have timer displays for both players
    await expect(page.locator('#player-blue')).toContainText('0"'); // Inactive player
    
    // Wait for active timer to count up
    await page.waitForTimeout(500);
    const hasActiveTimer = await page.locator('text=/[1-9]/').first().isVisible();
    expect(hasActiveTimer).toBe(true);
  });

  test('should show different states for active vs inactive players', async ({ page }) => {
    await page.goto('/');
    await page.click('text="Start"');
    
    // Initially both players show "start"
    await expect(page.locator('text="start"')).toHaveCount(2);
    
    // Start first player's timer
    await page.click('#player-red');
    await page.waitForTimeout(500);
    
    // Should now have timer displays for both players
    await expect(page.locator('#player-blue')).toContainText('0"');
    
    // Pass to next player by clicking active timer
    await page.click('#player-red'); // Click active red player
    await page.waitForTimeout(500);
    
    // Should still have timer displays for both players
    await expect(page.locator('#player-blue')).toContainText('0"');
  });

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Add a few players and start
    await page.click('text="+ player"');
    await page.click('text="Start"');
    
    // Check that all player start buttons are visible on mobile
    await expect(page.locator('text="start"')).toHaveCount(3);
    
    // Start a timer to test interaction on mobile
    await page.click('#player-red');
    
    // Should now have timer displays for all players
    await expect(page.locator('#player-blue')).toContainText('0"'); // Blue player inactive
  });

  test('should maintain layout integrity during timer transitions', async ({ page }) => {
    await page.goto('/');
    
    // Add players for more complex layout
    await page.click('text="+ player"');
    await page.click('text="+ player"');
    await page.click('text="Start"');
    
    // Should start with 4 player start buttons
    await expect(page.locator('text="start"')).toHaveCount(4);
    
    // Start timer and transition between players
    await page.click('#player-red');
    await page.waitForTimeout(300);
    await page.click('#player-red'); // Click active red player // Pass to next player
    await page.waitForTimeout(300);
    
    // Should maintain all timer displays
    await expect(page.locator('#player-blue')).toContainText('0"'); // Some players inactive
  });
});