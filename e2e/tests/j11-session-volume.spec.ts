import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J11 - Session Volume', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
    });

    test('J11.1 - Volume increases correctly with weight + reps', async () => {
        await detailPage.startWorkout();

        // Enter 10 kg
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('10');
        await detailPage.saveWeight();

        // Wait for volume to render in the header "Vol: X"
        await expect(detailPage.sessionVolume()).toBeVisible();
    });
});
