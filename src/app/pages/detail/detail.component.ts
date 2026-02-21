import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { HeaderComponent } from '../../components/header/header.component';
import { StartButtonComponent } from '../../components/start-button/start-button.component';
import { ExerciseItemComponent, WeightSaveEvent } from '../../components/exercise-item/exercise-item.component';
import { RestTimerComponent } from '../../components/rest-timer/rest-timer.component';
import { RestTimerService } from '../../services/rest-timer.service';
import {
    Workout,
    Exercise,
    ExerciseItem,
    ParsedSet,
    isExerciseGroup,
    getGroupName,
    countTotalExercises,
    hasMultipleSets,
    parseSeries
} from '../../models/workout.model';
import { kgToLb, formatWeight } from '../../utils/unit.utils';
import { SettingsService } from '../../services/settings.service';

/**
 * Detail Page Component
 * 
 * Shows workout details with exercises list and workout tracking.
 * This is a page-level component (smart component).
 */
@Component({
    selector: 'app-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, HeaderComponent, StartButtonComponent, ExerciseItemComponent, RestTimerComponent],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private workoutService = inject(WorkoutService);
    public settingsService = inject(SettingsService);
    private restTimerService = inject(RestTimerService);

    private timerInterval: ReturnType<typeof setInterval> | null = null;

    workout = signal<Workout | null>(null);
    editingExercise = signal<string | null>(null);
    timerSeconds = signal<number>(0);

    isWorkoutActive = computed(() => {
        const w = this.workout();
        return w ? this.workoutService.isWorkoutActive(w.id) : false;
    });

    totalExercises = computed(() => {
        const w = this.workout();
        return w ? countTotalExercises(w.exercices) : 0;
    });

    completedCount = computed(() => {
        const w = this.workout();
        if (!w) return 0;

        let count = 0;
        for (const item of w.exercices) {
            if (isExerciseGroup(item)) {
                for (const ex of item) {
                    if (this.workoutService.isExerciseCompleted(ex.description)) count++;
                }
            } else {
                if (this.workoutService.isExerciseCompleted(item.description)) count++;
            }
        }
        return count;
    });

    formattedTimer = computed(() => {
        const seconds = this.timerSeconds();
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    });

    sessionVolumeDisplay = computed(() => {
        const w = this.workout();
        if (!w || !this.isWorkoutActive()) return null;

        let totalVolumeKg = 0;

        for (const item of w.exercices) {
            const exercises = isExerciseGroup(item) ? item : [item];
            for (const ex of exercises) {
                if (this.workoutService.isExerciseCompleted(ex.description)) {
                    const sets = hasMultipleSets(ex.series) ? parseSeries(ex.series) : [{ label: 'Carga', reps: ex.series, isFailure: false }];

                    for (let i = 0; i < sets.length; i++) {
                        if (sets[i].isFailure) continue;
                        const weight = this.workoutService.getWeight(w.id, ex.description, i);
                        if (weight && weight > 0) {
                            // Tenta extrair um número razoável das reps (ex: "10", "8a12" -> 8)
                            const match = sets[i].reps.match(/\d+/);
                            const repsCount = match ? parseInt(match[0], 10) : 1; // Default to 1 se não achar nada literal
                            totalVolumeKg += (weight * repsCount);
                        }
                    }
                }
            }
        }

        if (totalVolumeKg === 0) return null;

        const unit = this.settingsService.unitSignal();
        const displayValue = unit === 'lb' ? kgToLb(totalVolumeKg) : totalVolumeKg;
        return formatWeight(displayValue, unit);
    });

    progressPercentage = computed(() => {
        const total = this.totalExercises();
        if (total === 0) return 0;
        return (this.completedCount() / total) * 100;
    });

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.router.navigate(['/']);
            return;
        }

        const existing = this.workoutService.getWorkoutById(id);
        if (existing) {
            this.workout.set(existing);
            this.restoreTimerIfActive();
        } else {
            this.workoutService.loadWorkouts().subscribe(() => {
                const w = this.workoutService.getWorkoutById(id);
                if (w) {
                    this.workout.set(w);
                    this.restoreTimerIfActive();
                } else {
                    this.router.navigate(['/']);
                }
            });
        }
    }

    ngOnDestroy(): void {
        this.stopTimer();
        this.restTimerService.closeTimer();
    }

    goBack(): void {
        this.router.navigate(['/']);
    }

    isGroup(item: ExerciseItem): item is Exercise[] {
        return isExerciseGroup(item);
    }

    getGroupLabel(group: Exercise[]): string {
        return getGroupName(group.length);
    }

    hasSets(exercise: Exercise): boolean {
        return hasMultipleSets(exercise.series);
    }

    getSets(exercise: Exercise): ParsedSet[] {
        return parseSeries(exercise.series);
    }

    startEditWeight(exerciseDescription: string, setIndex: number = 0): void {
        this.editingExercise.set(`${exerciseDescription}-${setIndex}`);
    }

    saveWeight(exercise: Exercise, setIndex: number, value: string): void {
        const weight = parseFloat(value);

        if (!isNaN(weight) && weight >= 0) {
            const w = this.workout();
            if (w) {
                this.workoutService.saveWeight(w.id, exercise.description, weight, setIndex);
                const updated = this.workoutService.getWorkoutById(w.id);
                if (updated) this.workout.set(updated);
            }
        }
        this.editingExercise.set(null);
    }

    cancelEdit(): void {
        this.editingExercise.set(null);
    }

    isEditing(exerciseDescription: string, setIndex: number = 0): boolean {
        return this.editingExercise() === `${exerciseDescription}-${setIndex}`;
    }

    getWeightForSet(exercise: Exercise, setIndex: number): number | undefined {
        const w = this.workout();
        if (!w) return undefined;
        return this.workoutService.getWeight(w.id, exercise.description, setIndex);
    }

    getWeightDisplay(exercise: Exercise, setIndex: number = 0): string {
        const weight = this.getWeightForSet(exercise, setIndex);
        if (weight !== undefined && weight > 0) {
            return `${weight}`;
        }
        return '—';
    }

    startWorkout(): void {
        const w = this.workout();
        if (!w) return;

        this.workoutService.startWorkout(w.id);
        this.startTimer();
    }

    finishWorkout(): void {
        this.stopTimer();
        this.workoutService.finishWorkout();
        this.timerSeconds.set(0);
    }

    toggleExercise(exercise: Exercise): void {
        if (!this.isWorkoutActive()) return;
        this.workoutService.toggleExerciseCompleted(exercise.description);

        // Start rest timer if it was mark as completed now
        if (this.workoutService.isExerciseCompleted(exercise.description)) {
            this.restTimerService.startTimer();
        }
    }

    isCompleted(exercise: Exercise): boolean {
        return this.workoutService.isExerciseCompleted(exercise.description);
    }

    /**
     * Get all weights for an exercise as a Record<setIndex, weight>
     */
    getWeightsForExercise(exercise: Exercise): Record<number, number> {
        const w = this.workout();
        if (!w) return {};

        const result: Record<number, number> = {};
        const sets = hasMultipleSets(exercise.series) ? parseSeries(exercise.series) : [{ label: 'Carga', reps: '', isFailure: false }];

        for (let i = 0; i < sets.length; i++) {
            const weight = this.workoutService.getWeight(w.id, exercise.description, i);
            if (weight !== undefined) {
                result[i] = weight;
            }
        }
        return result;
    }

    /**
     * Handler for weight save events from ExerciseItemComponent
     */
    onWeightSave(event: WeightSaveEvent): void {
        const w = this.workout();
        if (!w) return;

        this.workoutService.saveWeight(w.id, event.exerciseDescription, event.weight, event.setIndex);

        // Refresh workout data
        const updated = this.workoutService.getWorkoutById(w.id);
        if (updated) this.workout.set(updated);

        // Auto start rest timer on weight save
        this.restTimerService.startTimer();
    }

    startManualRest(): void {
        this.restTimerService.startTimer(30);
    }

    private startTimer(): void {
        this.updateTimerFromStartTime();
        this.timerInterval = setInterval(() => {
            this.updateTimerFromStartTime();
        }, 1000);
    }

    private updateTimerFromStartTime(): void {
        const activeWorkout = this.workoutService.activeWorkout();
        if (activeWorkout) {
            const elapsed = Math.floor((Date.now() - activeWorkout.startTime) / 1000);
            this.timerSeconds.set(elapsed);
        }
    }

    private stopTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private restoreTimerIfActive(): void {
        const w = this.workout();
        if (!w) return;

        if (this.workoutService.isWorkoutActive(w.id)) {
            this.startTimer();
        }
    }
}
