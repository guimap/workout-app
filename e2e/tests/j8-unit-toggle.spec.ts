import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J8 - Unit Toggle (kg/lb)', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
    });

    test('J8.1 - Toggle Unit formats weights immediately', async () => {
        await detailPage.startWorkout();

        // input 50 kg
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('50');
        await detailPage.saveWeight();
        await detailPage.expectWeightValue(0, '50');

        // toggle to lb
        await detailPage.unitToggleButton().click();
        // 50kg = ~110.2 lb
        await detailPage.expectWeightValue(0, '110.2');

        // toggle back to kg
        await detailPage.unitToggleButton().click();
        await detailPage.expectWeightValue(0, '50');
    });
});
