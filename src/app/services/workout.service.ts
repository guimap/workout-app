import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import {
    Workout,
    Exercise,
    ActiveWorkoutState,
    isExerciseGroup
} from '../models/workout.model';
import { WorkoutHttpRepository } from '../repository/workout-http.repository';
import { WorkoutStorageRepository } from '../repository/workout-storage.repository';

/**
 * Workout Service
 * 
 * Business logic layer for workout management.
 * This service orchestrates data from repositories and manages application state.
 * 
 * Responsibilities:
 * - Manage workout state (loading, error, data)
 * - Coordinate between HTTP and Storage repositories
 * - Handle workout session management (start, finish, toggles)
 * - Apply saved weights to loaded workouts
 */
@Injectable({
    providedIn: 'root'
})
export class WorkoutService {
    private httpRepo = inject(WorkoutHttpRepository);
    private storageRepo = inject(WorkoutStorageRepository);

    // Signals for reactive state
    private workoutsSignal = signal<Workout[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);
    private activeWorkoutSignal = signal<ActiveWorkoutState | null>(null);

    // Computed values (public API)
    readonly workouts = computed(() => this.workoutsSignal());
    readonly loading = computed(() => this.loadingSignal());
    readonly error = computed(() => this.errorSignal());
    readonly activeWorkout = computed(() => this.activeWorkoutSignal());

    constructor() {
        this.loadActiveWorkoutFromStorage();
    }

    // ========== Data Loading ==========

    /**
     * Load workouts from API and apply saved weights
     */
    loadWorkouts(): Observable<Workout[]> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.httpRepo.getWorkouts().pipe(
            tap(workouts => {
                const workoutsWithWeights = this.applyStoredWeights(workouts);
                this.workoutsSignal.set(workoutsWithWeights);
                this.loadingSignal.set(false);
            }),
            catchError(error => {
                console.error('Erro ao carregar treinos:', error);
                this.errorSignal.set('Erro ao carregar treinos. Tente novamente.');
                this.loadingSignal.set(false);
                return of([]);
            })
        );
    }

    /**
     * Get a workout by ID
     */
    getWorkoutById(id: string): Workout | undefined {
        return this.workoutsSignal().find(w => w.id === id);
    }

    // ========== Weight Management ==========

    /**
     * Save weight for an exercise set
     */
    saveWeight(workoutId: string, exerciseDescription: string, weight: number, setIndex: number = 0): void {
        // Persist to storage
        this.storageRepo.saveWeight(workoutId, exerciseDescription, weight, setIndex);

        // Update in-memory state
        this.updateWorkoutWeight(workoutId, exerciseDescription, weight, setIndex);
    }

    /**
     * Get saved weight for an exercise set
     */
    getWeight(workoutId: string, exerciseDescription: string, setIndex: number = 0): number | undefined {
        return this.storageRepo.getWeight(workoutId, exerciseDescription, setIndex);
    }

    // ========== Workout Session Management ==========

    /**
     * Start a workout session
     */
    startWorkout(workoutId: string): void {
        const activeWorkout: ActiveWorkoutState = {
            workoutId,
            startTime: Date.now(),
            elapsedSeconds: 0,
            completedExercises: new Set()
        };

        this.activeWorkoutSignal.set(activeWorkout);
        this.storageRepo.saveActiveWorkout(activeWorkout);
    }

    /**
     * Update elapsed time for the active workout
     */
    updateElapsedTime(seconds: number): void {
        const current = this.activeWorkoutSignal();
        if (current) {
            const updated = { ...current, elapsedSeconds: seconds };
            this.activeWorkoutSignal.set(updated);
        }
    }

    /**
     * Toggle exercise completion status
     */
    toggleExerciseCompleted(exerciseDescription: string): void {
        const current = this.activeWorkoutSignal();
        if (!current) return;

        const newCompleted = new Set(current.completedExercises);
        if (newCompleted.has(exerciseDescription)) {
            newCompleted.delete(exerciseDescription);
        } else {
            newCompleted.add(exerciseDescription);
        }

        const updated = { ...current, completedExercises: newCompleted };
        this.activeWorkoutSignal.set(updated);
        this.storageRepo.saveActiveWorkout(updated);
    }

    /**
     * Check if an exercise is completed
     */
    isExerciseCompleted(exerciseDescription: string): boolean {
        const current = this.activeWorkoutSignal();
        return current?.completedExercises.has(exerciseDescription) ?? false;
    }

    /**
     * Finish the active workout session
     */
    finishWorkout(): void {
        this.activeWorkoutSignal.set(null);
        this.storageRepo.clearActiveWorkout();
    }

    /**
     * Check if a workout is currently active
     */
    isWorkoutActive(workoutId: string): boolean {
        return this.activeWorkoutSignal()?.workoutId === workoutId;
    }

    // ========== Private Methods ==========

    private loadActiveWorkoutFromStorage(): void {
        const stored = this.storageRepo.getActiveWorkout();
        if (stored) {
            this.activeWorkoutSignal.set(stored);
        }
    }

    private applyStoredWeights(workouts: Workout[]): Workout[] {
        const weights = this.storageRepo.getWeights();

        return workouts.map(workout => ({
            ...workout,
            exercices: workout.exercices.map(item => {
                if (isExerciseGroup(item)) {
                    return item.map(ex => {
                        const key = `${workout.id}-${ex.description}-0`;
                        return weights[key] ? { ...ex, weight: weights[key] } : ex;
                    });
                }
                const key = `${workout.id}-${item.description}-0`;
                return weights[key] ? { ...item, weight: weights[key] } : item;
            })
        }));
    }

    private updateWorkoutWeight(workoutId: string, exerciseDescription: string, weight: number, setIndex: number): void {
        const workouts = this.workoutsSignal();
        const updatedWorkouts = workouts.map(workout => {
            if (workout.id !== workoutId) return workout;

            return {
                ...workout,
                exercices: workout.exercices.map(item => {
                    if (isExerciseGroup(item)) {
                        return item.map(ex => {
                            if (ex.description === exerciseDescription) {
                                const weights = ex.weights ? [...ex.weights] : [];
                                weights[setIndex] = weight;
                                return { ...ex, weights };
                            }
                            return ex;
                        });
                    }
                    if (item.description === exerciseDescription) {
                        const weights = item.weights ? [...item.weights] : [];
                        weights[setIndex] = weight;
                        return { ...item, weights };
                    }
                    return item;
                })
            };
        });

        this.workoutsSignal.set(updatedWorkouts);
    }
}
