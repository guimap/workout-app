import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J9 - History & PR', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
    });

    test('J9.1 - PR Badge behaviour and bug regression', async ({ page }) => {
        // --- SESSION 1 ---
        // Create a historical PR of 30kg
        await detailPage.startWorkout();

        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('30');
        await detailPage.saveWeight();

        // PR badge should be visible because 30 is the first and max weight saved
        await expect(detailPage.prBadges().first()).toBeVisible();

        // Finish session 1 to commit history
        await detailPage.finishWorkout();
        await page.waitForURL(/\//); // Back to home

        // --- SESSION 2 ---
        // Enter workout again
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
        await detailPage.startWorkout();

        // Try reaching the PR again
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('30');
        await detailPage.saveWeight();

        // Badge should show since 30 >= 30 (historical)
        await expect(detailPage.prBadges().first()).toBeVisible();

        // REGRESSION: Edit weight down to 29
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('29');
        await detailPage.saveWeight();

        // The maximum across THIS session is 29. 
        // The historical PR is 30.
        // 29 >= 30 is FALSE. The PR badge should NOT be visible anymore.
        await expect(detailPage.prBadges().first()).not.toBeVisible();
    });
});
