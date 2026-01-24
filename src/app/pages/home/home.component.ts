import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkoutService } from '../../services/workout.service';
import { Workout, countExercises } from '../../models/workout.model';

/**
 * Home Page Component
 * 
 * Main entry point showing the list of available workouts.
 * This is a page-level component (smart component).
 */
@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
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

    // Modal Logic
    showModal = false;

    openClearStorageModal(): void {
        this.showModal = true;
    }

    closeClearStorageModal(): void {
        this.showModal = false;
    }

    confirmClearStorage(): void {
        localStorage.clear();
        window.location.reload();
    }
}
