import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Workout, WorkoutData } from '../models/workout.model';

const API_URL = 'https://d3fgovm6dm6a55.cloudfront.net/treino.json';

/**
 * Workout HTTP Repository
 * 
 * Responsible for fetching workout data from the API.
 * This is a pure data access layer - no business logic.
 */
@Injectable({
    providedIn: 'root'
})
export class WorkoutHttpRepository {
    constructor(private http: HttpClient) { }

    /**
     * Fetches all workouts from the API
     */
    getWorkouts(): Observable<Workout[]> {
        return this.http.get<WorkoutData>(API_URL).pipe(
            map(data => data.days)
        );
    }
}
