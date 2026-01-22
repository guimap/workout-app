import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { Workout, countExercises } from '../../models/workout.model';

@Component({
    selector: 'app-workout-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './workout-list.component.html',
    styleUrl: './workout-list.component.css'
})
export class WorkoutListComponent implements OnInit {
    private workoutService = inject(WorkoutService);

    workouts = this.workoutService.workouts;
    loading = this.workoutService.loading;
    error = this.workoutService.error;

    ngOnInit(): void {
        this.workoutService.loadWorkouts().subscribe();
    }

    getExerciseCount(workout: Workout): number {
        return countExercises(workout.exercices);
    }

    getWorkoutLetter(index: number): string {
        return String.fromCharCode(65 + index); // A, B, C, etc.
    }
}
