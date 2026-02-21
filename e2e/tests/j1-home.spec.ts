import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';

test.describe('J1 - Tela Inicial (Home)', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goto();
    });

    test('J1.1 - Deve exibir header com título "Meus Treinos"', async () => {
        await homePage.expectHeaderVisible();
    });

    test('J1.2 - Deve exibir subtítulo', async ({ page }) => {
        await expect(page.locator('text=Selecione um treino para começar')).toBeVisible();
    });

    test('J1.3 - Deve listar 3 treinos (A, B, C)', async () => {
        await homePage.expectWorkoutCount(3);
    });

    test('J1.4 - Cada treino deve ter badge com letra', async ({ page }) => {
        await expect(page.locator('.workout-badge:has-text("A")')).toBeVisible();
        await expect(page.locator('.workout-badge:has-text("B")')).toBeVisible();
        await expect(page.locator('.workout-badge:has-text("C")')).toBeVisible();
    });

    test('J1.5 - FAB de limpar dados deve estar visível', async () => {
        await homePage.expectFabVisible();
    });

    test('J1.6 - Click em treino navega para detalhe', async ({ page }) => {
        await homePage.clickWorkoutByName('Treino A');
        await expect(page).toHaveURL(/\/workout\//);
    });

    test('J1.7 - FAB abre modal de confirmação', async () => {
        await homePage.openClearModal();
        await homePage.expectClearModalVisible();
    });
});
