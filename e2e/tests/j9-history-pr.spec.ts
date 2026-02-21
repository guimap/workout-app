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

    test('J9.1 - PR Badge appearance on new high score', async ({ page }) => {
        await detailPage.startWorkout();

        // input 50 kg
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('50');
        await detailPage.saveWeight();

        // PR badge should be visible because 50 is the first and max weight saved
        await expect(detailPage.prBadges().first()).toBeVisible();
    });
});
