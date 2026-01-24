import { test, expect, Page } from '@playwright/test';

/**
 * Detail Page - Page Object
 */
export class DetailPage {
    constructor(private page: Page) { }

    // Header Selectors
    readonly backButton = () => this.page.locator('.btn-back, button:has-text("Voltar")');
    readonly title = () => this.page.locator('app-header h1, .header-info h1');
    readonly counter = () => this.page.locator('app-header p, .header-info p');
    readonly timer = () => this.page.locator('.timer-badge');
    readonly progressBar = () => this.page.locator('.progress-bar-fill');

    // Exercise Selectors
    readonly exerciseCards = () => this.page.locator('.exercise-card, app-exercise-item');
    readonly exerciseNames = () => this.page.locator('.exercise-name');
    readonly biSetBadges = () => this.page.locator('.group-badge:has-text("BI-SET")');
    readonly checkboxes = () => this.page.locator('.checkbox-toggle');
    readonly completedCheckboxes = () => this.page.locator('.checkbox-toggle.completed');

    // Weight Selectors
    readonly weightButtons = () => this.page.locator('.weight-value');
    readonly weightInput = () => this.page.locator('.weight-input');
    readonly saveWeightButton = () => this.page.locator('.btn-save, button:has-text("Salvar")');
    readonly cancelWeightButton = () => this.page.locator('.btn-cancel, button:has-text("Cancelar")');
    readonly editWeightContainer = () => this.page.locator('.edit-weight-container');

    // Action Button Selectors
    readonly startButton = () => this.page.locator('button:has-text("Iniciar Treino")');
    readonly finishButton = () => this.page.locator('button:has-text("Finalizar Treino")');

    // Actions
    async goto(workoutId: string) {
        await this.page.goto(`/workout/${workoutId}`);
    }

    async goBack() {
        await this.backButton().click();
    }

    async startWorkout() {
        await this.startButton().click();
    }

    async finishWorkout() {
        await this.finishButton().click();
    }

    async toggleCheckbox(index: number) {
        await this.checkboxes().nth(index).click();
    }

    async openWeightEditor(index: number) {
        await this.weightButtons().nth(index).click();
    }

    async setWeight(value: string) {
        await this.weightInput().fill(value);
    }

    async saveWeight() {
        await this.saveWeightButton().click();
    }

    async cancelWeightEdit() {
        await this.cancelWeightButton().click();
    }

    // Assertions
    async expectTitleToBe(title: string) {
        await expect(this.title()).toHaveText(title);
    }

    async expectCounterToBe(text: string) {
        await expect(this.counter()).toContainText(text);
    }

    async expectTimerVisible() {
        await expect(this.timer()).toBeVisible();
    }

    async expectTimerHidden() {
        await expect(this.timer()).not.toBeVisible();
    }

    async expectStartButtonVisible() {
        await expect(this.startButton()).toBeVisible();
    }

    async expectFinishButtonVisible() {
        await expect(this.finishButton()).toBeVisible();
    }

    async expectCheckboxesVisible() {
        await expect(this.checkboxes().first()).toBeVisible();
    }

    async expectCompletedCount(count: number) {
        await expect(this.completedCheckboxes()).toHaveCount(count);
    }

    async expectWeightEditorVisible() {
        await expect(this.editWeightContainer()).toBeVisible();
    }

    async expectWeightValue(index: number, value: string) {
        await expect(this.weightButtons().nth(index)).toContainText(value);
    }
}
