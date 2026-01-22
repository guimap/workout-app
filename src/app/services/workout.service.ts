import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import {
    Workout,
    WorkoutData,
    Exercise,
    ExerciseItem,
    ActiveWorkoutState,
    isExerciseGroup
} from '../models/workout.model';

const API_URL = 'https://d3fgovm6dm6a55.cloudfront.net/treino.json';
const WEIGHTS_STORAGE_KEY = 'treino-app-weights';
const ACTIVE_WORKOUT_KEY = 'treino-app-active-workout';

@Injectable({
    providedIn: 'root'
})
export class WorkoutService {
    // Signals para estado reativo
    private workoutsSignal = signal<Workout[]>([]);
    private loadingSignal = signal<boolean>(false);
    private errorSignal = signal<string | null>(null);
    private activeWorkoutSignal = signal<ActiveWorkoutState | null>(null);

    // Computed values
    readonly workouts = computed(() => this.workoutsSignal());
    readonly loading = computed(() => this.loadingSignal());
    readonly error = computed(() => this.errorSignal());
    readonly activeWorkout = computed(() => this.activeWorkoutSignal());

    constructor(private http: HttpClient) {
        this.loadActiveWorkoutFromStorage();
    }

    /**
     * Carrega os treinos da API
     */
    loadWorkouts(): Observable<Workout[]> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.http.get<WorkoutData>(API_URL).pipe(
            map(data => data.days),
            tap(workouts => {
                // Aplicar pesos salvos do localStorage
                const savedWeights = this.getSavedWeights();
                const workoutsWithWeights = this.applyWeights(workouts, savedWeights);
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
     * Retorna um treino pelo ID
     */
    getWorkoutById(id: string): Workout | undefined {
        return this.workoutsSignal().find(w => w.id === id);
    }

    /**
     * Salva o peso de um exercício (para exercícios com set único)
     */
    saveWeight(workoutId: string, exerciseDescription: string, weight: number, setIndex: number = 0): void {
        const weights = this.getSavedWeights();
        const key = `${workoutId}-${exerciseDescription}-${setIndex}`;
        weights[key] = weight;
        localStorage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));

        // Atualizar o estado local
        this.updateWorkoutWeight(workoutId, exerciseDescription, weight, setIndex);
    }

    /**
     * Obtém o peso salvo para um set específico
     */
    getWeight(workoutId: string, exerciseDescription: string, setIndex: number = 0): number | undefined {
        const weights = this.getSavedWeights();
        const key = `${workoutId}-${exerciseDescription}-${setIndex}`;
        return weights[key];
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

    /**
     * Inicia um treino
     */
    startWorkout(workoutId: string): void {
        const activeWorkout: ActiveWorkoutState = {
            workoutId,
            startTime: Date.now(),
            elapsedSeconds: 0,
            completedExercises: new Set()
        };

        this.activeWorkoutSignal.set(activeWorkout);
        this.saveActiveWorkoutToStorage(activeWorkout);
    }

    /**
     * Atualiza o tempo decorrido do treino ativo
     */
    updateElapsedTime(seconds: number): void {
        const current = this.activeWorkoutSignal();
        if (current) {
            const updated = { ...current, elapsedSeconds: seconds };
            this.activeWorkoutSignal.set(updated);
        }
    }

    /**
     * Marca/desmarca um exercício como concluído
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
        this.saveActiveWorkoutToStorage(updated);
    }

    /**
     * Verifica se um exercício está concluído
     */
    isExerciseCompleted(exerciseDescription: string): boolean {
        const current = this.activeWorkoutSignal();
        return current?.completedExercises.has(exerciseDescription) ?? false;
    }

    /**
     * Finaliza o treino ativo
     */
    finishWorkout(): void {
        this.activeWorkoutSignal.set(null);
        localStorage.removeItem(ACTIVE_WORKOUT_KEY);
    }

    /**
     * Verifica se há um treino ativo para o workout especificado
     */
    isWorkoutActive(workoutId: string): boolean {
        return this.activeWorkoutSignal()?.workoutId === workoutId;
    }

    // ========== Métodos privados ==========

    private getSavedWeights(): Record<string, number> {
        const stored = localStorage.getItem(WEIGHTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }

    private applyWeights(workouts: Workout[], weights: Record<string, number>): Workout[] {
        return workouts.map(workout => ({
            ...workout,
            exercices: workout.exercices.map(item => {
                if (isExerciseGroup(item)) {
                    return item.map(ex => {
                        const key = `${workout.id}-${ex.description}`;
                        return weights[key] ? { ...ex, weight: weights[key] } : ex;
                    });
                }
                const key = `${workout.id}-${item.description}`;
                return weights[key] ? { ...item, weight: weights[key] } : item;
            })
        }));
    }

    private saveActiveWorkoutToStorage(state: ActiveWorkoutState): void {
        const serializable = {
            ...state,
            completedExercises: Array.from(state.completedExercises)
        };
        localStorage.setItem(ACTIVE_WORKOUT_KEY, JSON.stringify(serializable));
    }

    private loadActiveWorkoutFromStorage(): void {
        const stored = localStorage.getItem(ACTIVE_WORKOUT_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const state: ActiveWorkoutState = {
                ...parsed,
                completedExercises: new Set(parsed.completedExercises || [])
            };
            this.activeWorkoutSignal.set(state);
        }
    }
}
