import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J7 - Rest Timer', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
        await detailPage.startWorkout();
    });

    test('J7.1 - Manual start rest timer', async () => {
        await detailPage.expectRestTimerHidden();
        await detailPage.manualRestButton().click();
        await detailPage.expectRestTimerVisible();
        await expect(detailPage.restTimerValue()).toContainText('00:');
    });

    test('J7.2 - Auto start rest timer on checkbox', async () => {
        await detailPage.expectRestTimerHidden();
        await detailPage.toggleCheckbox(0);
        await detailPage.expectRestTimerVisible();
    });

    test('J7.3 - Add +30s to timer', async () => {
        await detailPage.manualRestButton().click();
        await detailPage.expectRestTimerVisible();

        await detailPage.restTimerAdd30sButton().click();
        // Since it starts at 30s, +30s makes it 1:00 or 00:59 depending on ticks
        await expect(detailPage.restTimerValue()).toContainText('00:5', { timeout: 3000 });
    });

    test('J7.4 - Skip/Close timer', async () => {
        await detailPage.manualRestButton().click();
        await detailPage.expectRestTimerVisible();
        await detailPage.restTimerSkipButton().click();
        await detailPage.expectRestTimerHidden();
    });
});
