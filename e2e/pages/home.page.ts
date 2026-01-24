import { test, expect, Page } from '@playwright/test';

/**
 * Home Page - Page Object
 */
export class HomePage {
    constructor(private page: Page) { }

    // Selectors
    readonly header = () => this.page.locator('h1:has-text("Meus Treinos")');
    readonly subtitle = () => this.page.locator('text=Selecione um treino para começar');
    readonly workoutCards = () => this.page.locator('.workout-card');
    readonly workoutBadges = () => this.page.locator('.workout-badge');
    readonly fabButton = () => this.page.locator('.fab-clear');
    readonly clearModal = () => this.page.locator('.modal-overlay');
    readonly confirmClearButton = () => this.page.locator('button:has-text("Confirmar")');
    readonly cancelClearButton = () => this.page.locator('button:has-text("Cancelar")');

    // Actions
    async goto() {
        await this.page.goto('/');
    }

    async clickWorkout(index: number) {
        await this.workoutCards().nth(index).click();
    }

    async clickWorkoutByName(name: string) {
        await this.page.locator(`.workout-card:has-text("${name}")`).click();
    }

    async openClearModal() {
        await this.fabButton().click();
    }

    async confirmClear() {
        await this.confirmClearButton().click();
    }

    async cancelClear() {
        await this.cancelClearButton().click();
    }

    // Assertions
    async expectHeaderVisible() {
        await expect(this.header()).toBeVisible();
    }

    async expectWorkoutCount(count: number) {
        await expect(this.workoutCards()).toHaveCount(count);
    }

    async expectFabVisible() {
        await expect(this.fabButton()).toBeVisible();
    }

    async expectClearModalVisible() {
        await expect(this.clearModal()).toBeVisible();
    }
}
