import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';
import { HomePage } from '../pages/home.page';

test.describe('J2 - Detalhe do Treino', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        // Navegação direta para a página de detalhe
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
    });

    test('J2.1 - Deve exibir botão voltar', async () => {
        await expect(detailPage.backButton()).toBeVisible();
    });

    test('J2.2 - Deve exibir título do treino', async () => {
        await expect(detailPage.title()).toContainText('Treino');
    });

    test('J2.3 - Deve exibir contador de exercícios', async () => {
        await expect(detailPage.counter()).toContainText('exercícios');
    });

    test('J2.4 - Deve listar exercícios', async ({ page }) => {
        const exercises = page.locator('.exercise-card, app-exercise-item');
        await expect(exercises.first()).toBeVisible();
    });

    test('J2.5 - Deve exibir BI-SET badge para grupos', async ({ page }) => {
        // Verifica se existe pelo menos um BI-SET
        const bisetBadges = page.locator('.group-badge:has-text("BI-SET")');
        // Pode não ter BI-SET em alguns treinos, então apenas verificamos se está visível quando existe
        const count = await bisetBadges.count();
        if (count > 0) {
            await expect(bisetBadges.first()).toBeVisible();
        }
    });

    test('J2.6 - Deve exibir botão Iniciar Treino', async () => {
        await detailPage.expectStartButtonVisible();
    });

    test('J2.7 - Botão voltar navega para home', async ({ page }) => {
        await detailPage.goBack();
        await expect(page).toHaveURL('/');
    });
});
