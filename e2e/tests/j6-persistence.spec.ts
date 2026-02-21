import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J6 - Persistência', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        // Limpar localStorage antes de cada teste
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('J6.1 - Estado do treino persiste após reload', async ({ page }) => {
        // Navegar e iniciar treino
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
        await detailPage.startWorkout();

        // Marcar exercício
        await detailPage.toggleCheckbox(0);
        await expect(page.locator('.checkbox-toggle').nth(0)).toHaveClass(/completed/);

        // Reload
        await page.reload();

        // Estado deve persistir
        await expect(page.locator('.checkbox-toggle').nth(0)).toHaveClass(/completed/);
    });

    test('J6.2 - Timer continua após reload', async ({ page }) => {
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
        await detailPage.startWorkout();

        // Esperar alguns segundos
        await page.waitForTimeout(2000);

        // Capturar timer
        const timerBefore = await detailPage.timer().textContent();

        // Reload
        await page.reload();

        // Timer deve continuar (não resetar para 00:00)
        await detailPage.expectTimerVisible();
        const timerAfter = await detailPage.timer().textContent();

        // Timer deve ser >= ao anterior (pode ter avançado durante reload)
        expect(timerAfter).not.toBe('00:00');
    });

    test('J6.3 - Pesos persistem após reload', async ({ page }) => {
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);

        // Salvar peso
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('42');
        await detailPage.saveWeight();
        await page.waitForTimeout(500);

        // Reload
        await page.reload();

        // Peso deve persistir
        await detailPage.expectWeightValue(0, '42');
    });

    test('J6.4 - Contador de exercícios persiste', async ({ page }) => {
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
        await detailPage.startWorkout();

        // Marcar 2 exercícios
        await detailPage.toggleCheckbox(0);
        await detailPage.toggleCheckbox(1);

        // Reload
        await page.reload();

        // Contador deve mostrar 2 concluídos
        await expect(detailPage.counter()).toContainText('2 de');
    });

    test('J6.5 - Navegar para home e voltar mantém estado', async ({ page }) => {
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
        await detailPage.startWorkout();
        await detailPage.toggleCheckbox(0);

        // Voltar para home
        await detailPage.goBack();
        await expect(page).toHaveURL('/');

        // Voltar para detalhe
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);

        // Estado deve persistir
        await expect(page.locator('.checkbox-toggle').nth(0)).toHaveClass(/completed/);
        await detailPage.expectTimerVisible();
    });
});
