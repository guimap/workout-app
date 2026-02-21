import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J3 - Treino Ativo', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        // Navegar para treino e iniciar
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
    });

    test('J3.1 - Timer não aparece antes de iniciar', async () => {
        await detailPage.expectTimerHidden();
    });

    test('J3.2 - Click em Iniciar Treino mostra timer', async () => {
        await detailPage.startWorkout();
        await detailPage.expectTimerVisible();
    });

    test('J3.3 - Checkboxes aparecem após iniciar', async () => {
        await detailPage.startWorkout();
        await detailPage.expectCheckboxesVisible();
    });

    test('J3.4 - Botão muda para Finalizar Treino', async () => {
        await detailPage.startWorkout();
        await detailPage.expectFinishButtonVisible();
    });

    test('J3.5 - Timer incrementa', async ({ page }) => {
        await detailPage.startWorkout();

        // Capturar timer inicial
        const timerText1 = await detailPage.timer().textContent();

        // Esperar 2 segundos
        await page.waitForTimeout(2000);

        // Timer deve ter mudado
        const timerText2 = await detailPage.timer().textContent();
        expect(timerText1).not.toBe(timerText2);
    });

    test('J3.6 - Finalizar treino esconde timer', async () => {
        await detailPage.startWorkout();
        await detailPage.expectTimerVisible();

        await detailPage.finishWorkout();
        await detailPage.expectTimerHidden();
    });
});
