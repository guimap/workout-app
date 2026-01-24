import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J5 - Checkbox / Completar Exercício', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);

        // Iniciar treino para ter checkboxes
        await detailPage.startWorkout();
    });

    test('J5.1 - Click em checkbox marca como concluído', async ({ page }) => {
        await detailPage.toggleCheckbox(0);

        // Checkbox deve estar marcado
        const checkbox = page.locator('.checkbox-toggle').nth(0);
        await expect(checkbox).toHaveClass(/completed/);
    });

    test('J5.2 - Checkbox marcado tem ícone de check', async ({ page }) => {
        await detailPage.toggleCheckbox(0);

        const checkbox = page.locator('.checkbox-toggle').nth(0);
        const svg = checkbox.locator('svg');
        await expect(svg).toBeVisible();
    });

    test('J5.3 - Card ativo tem borda verde', async ({ page }) => {
        await detailPage.toggleCheckbox(0);

        const card = page.locator('.exercise-card, app-exercise-item .exercise-card').nth(0);
        await expect(card).toHaveClass(/card-active/);
    });

    test('J5.4 - Contador atualiza após marcar', async ({ page }) => {
        // Pegar contador inicial
        const counterBefore = await detailPage.counter().textContent();

        await detailPage.toggleCheckbox(0);

        // Contador deve ter mudado
        await page.waitForTimeout(500);
        const counterAfter = await detailPage.counter().textContent();
        expect(counterBefore).not.toBe(counterAfter);
    });

    test('J5.5 - Click novamente desmarca checkbox', async ({ page }) => {
        await detailPage.toggleCheckbox(0);
        await expect(page.locator('.checkbox-toggle').nth(0)).toHaveClass(/completed/);

        await detailPage.toggleCheckbox(0);
        await expect(page.locator('.checkbox-toggle').nth(0)).not.toHaveClass(/completed/);
    });

    test('J5.6 - Múltiplos checkboxes podem ser marcados', async () => {
        await detailPage.toggleCheckbox(0);
        await detailPage.toggleCheckbox(1);

        await detailPage.expectCompletedCount(2);
    });
});
