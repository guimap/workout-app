import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise, ParsedSet, hasMultipleSets, parseSeries } from '../../models/workout.model';
import { SettingsService } from '../../services/settings.service';
import { WorkoutService } from '../../services/workout.service';
import { ExerciseHistoryRecord } from '../../repository/workout-storage.repository';
import { kgToLb, lbToKg, formatWeight, roundWeight } from '../../utils/unit.utils';

/**
 * Weight Save Event
 */
export interface WeightSaveEvent {
    exerciseDescription: string;
    setIndex: number;
    weight: number;
}

/**
 * Exercise Item Component
 * 
 * Displays a single exercise with:
 * - Checkbox for completion tracking
 * - Exercise name and series
 * - Weight editing for single or multiple sets
 * 
 * @Input exercise - The exercise to display
 * @Input isGrouped - Whether this exercise is part of a bi-set/tri-set
 * @Input isActive - Whether the workout is currently active (shows checkbox)
 * @Input isCompleted - Whether the exercise is marked as completed
 * @Input weights - Map of saved weights by set index
 * @Output toggle - Emits when checkbox is clicked
 * @Output weightSave - Emits when weight is saved with exercise description, set index, and weight value
 */
@Component({
    selector: 'app-exercise-item',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './exercise-item.component.html',
    styleUrl: './exercise-item.component.css'
})
export class ExerciseItemComponent {
    @Input({ required: true }) exercise!: Exercise;
    @Input() isGrouped = false;
    @Input() isActive = false;
    @Input() isCompleted = false;
    @Input() weights: Record<number, number> = {};

    @Output() toggle = new EventEmitter<void>();
    @Output() weightSave = new EventEmitter<WeightSaveEvent>();

    // Internal state for editing
    editingSetIndex = signal<number | null>(null);

    // Dependencies
    settingsService = inject(SettingsService);
    workoutService = inject(WorkoutService);

    // Computed properties
    get hasSets(): boolean {
        return hasMultipleSets(this.exercise.series);
    }

    get sets(): ParsedSet[] {
        return parseSeries(this.exercise.series);
    }

    // Methods
    onToggle(): void {
        this.toggle.emit();
    }

    getWeightForSet(setIndex: number): number | undefined {
        return this.weights[setIndex];
    }

    getWeightDisplay(setIndex: number): string {
        const weightKg = this.getWeightForSet(setIndex);
        if (weightKg !== undefined && weightKg > 0) {
            const unit = this.settingsService.unitSignal();
            const value = unit === 'lb' ? kgToLb(weightKg) : weightKg;
            return `${roundWeight(value, unit)}`;
        }
        return '—';
    }

    getCurrentUnit(): string {
        return this.settingsService.unitSignal();
    }

    getPreviousRecord(): ExerciseHistoryRecord | null {
        return this.workoutService.getPreviousRecord(this.exercise.description);
    }

    getPreviousRecordDisplay(): string {
        const record = this.getPreviousRecord();
        if (!record) return '';

        const unit = this.settingsService.unitSignal();
        const value = unit === 'lb' ? kgToLb(record.weight) : record.weight;
        return `${roundWeight(value, unit)} ${unit}`;
    }

    isPersonalRecord(setIndex: number): boolean {
        const currentKg = this.getWeightForSet(setIndex);
        if (!currentKg || currentKg <= 0) return false;

        const prKg = this.workoutService.getPersonalRecord(this.exercise.description);
        // Se bateu o PR e é maior que 0
        return prKg > 0 && currentKg >= prKg;
    }

    startEdit(setIndex: number): void {
        this.editingSetIndex.set(setIndex);
    }

    cancelEdit(): void {
        this.editingSetIndex.set(null);
    }

    isEditing(setIndex: number): boolean {
        return this.editingSetIndex() === setIndex;
    }

    saveWeight(setIndex: number, value: string): void {
        const weightInput = parseFloat(value);
        if (!isNaN(weightInput) && weightInput >= 0) {
            const unit = this.settingsService.unitSignal();
            const weightKg = unit === 'lb' ? lbToKg(weightInput) : weightInput;

            this.weightSave.emit({
                exerciseDescription: this.exercise.description,
                setIndex,
                weight: weightKg
            });
        }
        this.editingSetIndex.set(null);
    }
}
