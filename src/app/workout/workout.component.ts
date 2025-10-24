import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WorkoutsService } from '../core/workout.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Exercise, Workout } from '../core/workout.model';
import { interval, map, Observable, shareReplay } from 'rxjs';
import { E, T } from '@angular/cdk/keycodes';

type Ex = { description: string; series: string; done?: boolean; kg?: number | null };
type Item = Ex | Ex[]; // simples ou grupo
type Day = { id: string; exercices: Item[] };

@Component({
    standalone: true,
    selector: 'app-workout',
    imports: [
        CommonModule, FormsModule,
        MatCardModule, MatDividerModule,
        MatFormFieldModule, MatInputModule, MatCheckboxModule,
        MatIconModule, MatButtonModule, MatProgressBarModule,
        MatChipsModule
    ],
    templateUrl: './workout.component.html',
    styleUrls: ['./workout.component.css']
})
export class WorkoutComponent {
    private route = inject(ActivatedRoute);
    public running: boolean = false;
    svc = inject(WorkoutsService);

    public workoutSeconds: number = 0;
    public timeLeft$: Observable<string> = new Observable<string>();
    public timerPaused: boolean = false;
    public timerStarted: boolean = false;

    // id do dia: /treino/:id (ex.: uokfxwo, b0kxidu, ev9v0u9)
    id = computed(() => (this.route.snapshot.paramMap.get('id') ?? '').toLowerCase());

    // dia atual a partir do service
    day = computed<Workout | null>(() => {
        const d = this.svc.getDayById(this.id());
        //  Verifica se possui estado no localstorage
        const id = d?.id || '';
        const localState = sessionStorage.getItem(id);
        if (localState) {
            // console.log(JSON.parse(localState) as Exercise[] | Exercise[][])
            const workout = localState ? JSON.parse(localState) : {};
            return { exercises: workout } as Workout;
            // return workout;
        } else {

            if (!d) return null;
            d.exercises.forEach((it: Exercise | Exercise[]) => {
                if (Array.isArray(it)) {
                    it.forEach(e => {
                        if (e.done === undefined) e.done = false;
                        if (e.kg === undefined) e.kg = null;
                    });
                } else {
                    if (it.done === undefined) it.done = false;
                    if (it.kg === undefined) it.kg = null;
                }
            });
            return d;
        }
        // normaliza: garante done/kg para não quebrar ngModel
    });

    // helpers
    isGroup = (it: Exercise | Exercise[]): it is Exercise[] => Array.isArray(it);

    flatten<T>(items: T[] = []): T[] {
        return items.flatMap(it => Array.isArray(it) ? it : [it]);
    }

    progress(): number {
        const all: (Exercise | Exercise[])[] = this.flatten<Exercise | Exercise[]>(this.day()?.exercises ?? []);
        if (!all.length) return 0;
        const done = this.normalizeExercises(all).filter(e => !!e.done).length;
        return Math.round((done / all.length) * 100);
    }

    normalizeExercises(
        exercises: (Exercise | Exercise[])[]
    ): Exercise[] {
        if (Array.isArray(exercises[0])) {
            // É uma matriz → faz flat
            return (exercises as Exercise[][]).flat();
        }

        // Já é uma lista simples
        return exercises as Exercise[];
    }

    start() {
        this.running = true;
        if (!this.timerStarted) {
            this.timerStarted = true;
            this.running = true;
            this.timeLeft$ = interval(1000).pipe(
                map(x => {
                    if (!this.running) {
                        // Silence is gold
                    } else {
                        this.workoutSeconds += 1;
                    }
                    return this.formatSecondsToHHMMSS(this.workoutSeconds);
                }),
                shareReplay(1)
            );
        } else {
            // this.timerStarted = true;
        }
    }

    pause() {
        this.running = false;
    }

    reset() {
        this.workoutSeconds = 0;
    }

    getWorkouts() {
        return (this.day()!.exercises as any[]) ?? [];
    }

    formatSecondsToHHMMSS(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (n: number) => n.toString().padStart(2, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    }

    /**
     * @desc salva a carga de cada exercicio
     */
    saveKg() {
        const state = JSON.stringify(this.day()?.exercises);
        const cloned = JSON.parse(state) as Exercise[] | Exercise[][];
        for (const it of cloned) {
            if (Array.isArray(it)) {
                for (const sub of it) {
                    sub.done = false;
                }
            } else {
                it.done = false;
            }
        }
        console.log(cloned)
        sessionStorage.setItem(this.day()!.id, JSON.stringify(cloned));
    }


}
