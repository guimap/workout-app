import { test, expect } from '@playwright/test';
import { DetailPage } from '../pages/detail.page';

test.describe('J4 - Editar Carga', () => {
    let detailPage: DetailPage;

    test.beforeEach(async ({ page }) => {
        detailPage = new DetailPage(page);
        await page.goto('/');
        await page.locator('.workout-card').first().click();
        await page.waitForURL(/\/workout\//);
    });

    test('J4.1 - Click em peso abre editor', async () => {
        await detailPage.openWeightEditor(0);
        await detailPage.expectWeightEditorVisible();
    });

    test('J4.2 - Editor tem input numérico', async ({ page }) => {
        await detailPage.openWeightEditor(0);
        const input = page.locator('.weight-input');
        await expect(input).toBeVisible();
        await expect(input).toHaveAttribute('type', 'number');
    });

    test('J4.3 - Editor tem botões Cancelar e Salvar', async ({ page }) => {
        await detailPage.openWeightEditor(0);
        await expect(page.locator('button:has-text("Cancelar"), .btn-cancel')).toBeVisible();
        await expect(page.locator('button:has-text("Salvar"), .btn-save')).toBeVisible();
    });

    test('J4.4 - Cancelar fecha editor sem salvar', async ({ page }) => {
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('50');
        await detailPage.cancelWeightEdit();

        // Editor deve fechar
        await expect(page.locator('.edit-weight-container')).not.toBeVisible();

        // Valor não deve ter mudado
        const weightButton = detailPage.weightButtons().nth(0);
        await expect(weightButton).not.toContainText('50');
    });

    test('J4.5 - Salvar persiste valor', async ({ page }) => {
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('25');
        await detailPage.saveWeight();

        // Editor deve fechar
        await expect(page.locator('.edit-weight-container')).not.toBeVisible();

        // Valor deve mostrar 25
        await page.waitForTimeout(500); // Aguardar atualização
        await detailPage.expectWeightValue(0, '25');
    });

    test('J4.6 - Peso salvo mostra unidade kg', async ({ page }) => {
        await detailPage.openWeightEditor(0);
        await detailPage.setWeight('30');
        await detailPage.saveWeight();

        await page.waitForTimeout(500);
        const weightButton = detailPage.weightButtons().nth(0);
        await expect(weightButton).toContainText('kg');
    });
});
