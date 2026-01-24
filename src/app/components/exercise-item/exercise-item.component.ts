import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Exercise, ParsedSet, hasMultipleSets, parseSeries } from '../../models/workout.model';

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
        const weight = this.getWeightForSet(setIndex);
        if (weight !== undefined && weight > 0) {
            return `${weight}`;
        }
        return '—';
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
        const weight = parseFloat(value);
        if (!isNaN(weight) && weight >= 0) {
            this.weightSave.emit({
                exerciseDescription: this.exercise.description,
                setIndex,
                weight
            });
        }
        this.editingSetIndex.set(null);
    }
}
