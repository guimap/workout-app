import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
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

@Component({
    selector: 'app-workout-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './workout-detail.component.html',
    styleUrl: './workout-detail.component.css'
})
export class WorkoutDetailComponent implements OnInit, OnDestroy {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private workoutService = inject(WorkoutService);

    private timerInterval: ReturnType<typeof setInterval> | null = null;

    workout = signal<Workout | null>(null);
    editingExercise = signal<string | null>(null); // Format: "description-setIndex"
    timerSeconds = signal<number>(0);

    isWorkoutActive = computed(() => {
        const w = this.workout();
        return w ? this.workoutService.isWorkoutActive(w.id) : false;
    });

    // Na tela de detalhes, contamos todos os exercícios individuais
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

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.router.navigate(['/']);
            return;
        }

        // Load workouts if not loaded
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

    // Multi-set support
    hasSets(exercise: Exercise): boolean {
        return hasMultipleSets(exercise.series);
    }

    getSets(exercise: Exercise): ParsedSet[] {
        return parseSeries(exercise.series);
    }

    // Weight editing
    startEditWeight(exerciseDescription: string, setIndex: number = 0): void {
        this.editingExercise.set(`${exerciseDescription}-${setIndex}`);
    }

    saveWeight(exercise: Exercise, setIndex: number, event: Event): void {
        const input = event.target as HTMLInputElement;
        const weight = parseFloat(input.value);

        if (!isNaN(weight) && weight >= 0) {
            const w = this.workout();
            if (w) {
                this.workoutService.saveWeight(w.id, exercise.description, weight, setIndex);
                // Refresh workout data
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

    // Workout timer
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
    }

    isCompleted(exercise: Exercise): boolean {
        return this.workoutService.isExerciseCompleted(exercise.description);
    }

    /**
     * Timer agora calcula o tempo decorrido com base no startTime,
     * evitando problemas de suspensão do navegador em dispositivos móveis.
     */
    private startTimer(): void {
        // Calcular imediatamente ao iniciar
        this.updateTimerFromStartTime();

        // Atualizar a cada segundo
        this.timerInterval = setInterval(() => {
            this.updateTimerFromStartTime();
        }, 1000);
    }

    private updateTimerFromStartTime(): void {
        const activeWorkout = this.workoutService.activeWorkout();
        if (activeWorkout) {
            // Calcula o tempo decorrido desde o início do treino
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
            // Calcular tempo decorrido e iniciar timer
            this.startTimer();
        }
    }
}
