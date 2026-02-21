import { Injectable } from '@angular/core';
import { ActiveWorkoutState } from '../models/workout.model';

const WEIGHTS_STORAGE_KEY = 'treino-app-weights';
const ACTIVE_WORKOUT_KEY = 'treino-app-active-workout';
const EXERCISE_HISTORY_KEY = 'treino-app-exercise-history';

export interface ExerciseHistoryRecord {
    date: number;
    weight: number;
    reps?: string;
}

/**
 * Serializable version of ActiveWorkoutState for localStorage
 */
interface SerializableActiveWorkout {
    workoutId: string;
    startTime: number;
    elapsedSeconds: number;
    completedExercises: string[];
}

/**
 * Workout Storage Repository
 * 
 * Responsible for persisting workout data in localStorage.
 * Handles:
 * - Exercise weights per workout/exercise/set
 * - Active workout state (for resuming sessions)
 */
@Injectable({
    providedIn: 'root'
})
export class WorkoutStorageRepository {

    // ========== Weights Storage ==========

    /**
     * Get all saved weights
     */
    getWeights(): Record<string, number> {
        const stored = localStorage.getItem(WEIGHTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Get weight for a specific exercise set
     */
    getWeight(workoutId: string, exerciseDescription: string, setIndex: number = 0): number | undefined {
        const weights = this.getWeights();
        const key = this.getWeightKey(workoutId, exerciseDescription, setIndex);
        return weights[key];
    }

    /**
     * Save weight for a specific exercise set
     */
    saveWeight(workoutId: string, exerciseDescription: string, weight: number, setIndex: number = 0): void {
        const weights = this.getWeights();
        const key = this.getWeightKey(workoutId, exerciseDescription, setIndex);
        weights[key] = weight;
        localStorage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
    }

    /**
     * Generate key for weight storage
     */
    private getWeightKey(workoutId: string, exerciseDescription: string, setIndex: number): string {
        return `${workoutId}-${exerciseDescription}-${setIndex}`;
    }

    // ========== History Storage ==========

    /**
     * Get all exercise history
     */
    getExerciseHistory(): Record<string, ExerciseHistoryRecord[]> {
        const stored = localStorage.getItem(EXERCISE_HISTORY_KEY);
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Get previous record for an exercise that is NOT from today's session
     */
    getPreviousRecord(exerciseDescription: string, currentSessionStart: number): ExerciseHistoryRecord | null {
        const history = this.getExerciseHistory();
        const records = history[exerciseDescription];
        if (!records || records.length === 0) return null;

        // Find the most recent record that is strictly before the current session start
        const previousRecords = records.filter(r => r.date < currentSessionStart);
        if (previousRecords.length === 0) return null;

        // Sort descending by date
        previousRecords.sort((a, b) => b.date - a.date);
        return previousRecords[0];
    }

    /**
     * Get the absolute maximum weight ever lifted for this exercise (Personal Record)
     */
    getPersonalRecord(exerciseDescription: string): number {
        const history = this.getExerciseHistory();
        const records = history[exerciseDescription];
        if (!records || records.length === 0) return 0;

        return Math.max(...records.map(r => r.weight));
    }

    /**
     * Save a new history record
     */
    saveToHistory(exerciseDescription: string, weight: number, date: number): void {
        const history = this.getExerciseHistory();
        if (!history[exerciseDescription]) {
            history[exerciseDescription] = [];
        }

        // Add or update record for this specific timestamp (session)
        const records = history[exerciseDescription];
        const existingIndex = records.findIndex(r => r.date === date);

        if (existingIndex >= 0) {
            // Se já salvou no mesmo treino/horário, apenas atualiza caso seja maior ou diferente?
            // Vamos apenas sobrescrever pra manter a última carga do set (MVP)
            records[existingIndex] = { date, weight };
        } else {
            records.push({ date, weight });
        }

        localStorage.setItem(EXERCISE_HISTORY_KEY, JSON.stringify(history));
    }

    // ========== Active Workout Storage ==========

    /**
     * Get the active workout state from storage
     */
    getActiveWorkout(): ActiveWorkoutState | null {
        const stored = localStorage.getItem(ACTIVE_WORKOUT_KEY);
        if (!stored) return null;

        try {
            const parsed: SerializableActiveWorkout = JSON.parse(stored);
            return {
                workoutId: parsed.workoutId,
                startTime: parsed.startTime,
                elapsedSeconds: parsed.elapsedSeconds,
                completedExercises: new Set(parsed.completedExercises || [])
            };
        } catch {
            return null;
        }
    }

    /**
     * Save the active workout state to storage
     */
    saveActiveWorkout(state: ActiveWorkoutState): void {
        const serializable: SerializableActiveWorkout = {
            workoutId: state.workoutId,
            startTime: state.startTime,
            elapsedSeconds: state.elapsedSeconds,
            completedExercises: Array.from(state.completedExercises)
        };
        localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(serializable));
    }

    /**
     * Clear the active workout from storage
     */
    clearActiveWorkout(): void {
        localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }

    /**
     * Clear all local data (weights + active workout)
     */
    clearAll(): void {
        localStorage.removeItem(WEIGHTS_STORAGE_KEY);
        localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }
}
