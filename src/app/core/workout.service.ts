import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { Exercise, Workout } from './workout.model';
import { R } from '@angular/cdk/keycodes';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {
    private http = inject(HttpClient);
    private readonly URL = 'https://d3fgovm6dm6a55.cloudfront.net/treino.json';

    private store = signal<Workout[]>([]);
    list = this.store.asReadonly();

    loading = signal<boolean>(false);
    error = signal<string | null>(null);

    constructor() {
        this.reload(); // carrega ao iniciar
    }

    /** Recarrega os treinos do endpoint remoto */
    reload() {
        this.loading.set(true);
        this.error.set(null);

        this.http.get<unknown>(this.URL).pipe(
            map(raw => this.parseWorkouts(raw)),
            catchError(err => {
                console.error('Workouts load error', err);
                this.error.set('Falha ao carregar treinos. Tente novamente.');
                return of<Workout[]>([]);
            })
        ).subscribe(items => {
            console.log('Loaded workouts', items);
            this.store.set(items);
            this.loading.set(false);
        });
    }

    /** Aceita formatos {workouts:[...]} ou [...] e normaliza para o nosso modelo */
    private parseWorkouts(result: any): Workout[] {
        const raw = result.days || [];
        console.log('Raw data', raw);
        const data = Array.isArray(raw) ? raw : raw?.workouts;
        if (!Array.isArray(data)) return [];

        return data.map((w: any, idx: number) => {
            console.log('Raw workout', w);
            const workout: Workout = {
                id: w.id,
                title: w.title,
                notes: w.notes ?? undefined,
                createdAt: Number(w.createdAt ?? Date.now()),
                exercises: []
            }
            for (const e of w.exercices || []) {
                console.log('Raw exercise', e);
                if (Array.isArray(e)) {
                    const listExercices: Exercise[] = []
                    for (const ex of e) {
                        listExercices.push({
                            id: String(ex.id ?? `${idx}-`),
                            name: String(ex.description ?? 'Exercício'),
                            series: String(ex.series ?? '3x10'),
                            kg: ex.kg != null ? Number(ex.kg) : null,
                            done: Boolean(ex.done ?? false),
                        });
                    }
                    (workout.exercises as Exercise[][]).push(listExercices);
                } else {
                    const exercice: Exercise = {
                        id: String(e.id ?? `${idx}-`),
                        name: String(e.description ?? 'Exercício'),
                        series: String(e.series ?? '3x10'),
                        kg: e.kg != null ? Number(e.kg) : null,
                        done: Boolean(e.done ?? false),
                    };
                    (workout.exercises as Exercise[]).push(exercice);
                }
            }

            return workout;

        });
    }

    getById(id: string) {
        return this.store().find(w => w.id.toLowerCase() === id.toLowerCase()) ?? null;
    }
    getDayById(id: string): Workout | null {
        return this.getById(id);
    }
    /** Cria localmente um treino em memória (ex.: rascunho) */
    addBlank() {
        const nextId = String.fromCharCode(65 + this.store().length); // A,B,C...
        const w: Workout = {
            id: nextId,
            title: `Treino ${nextId}`,
            createdAt: Date.now(),
            exercises: [],
        };
        this.store.update(arr => [w, ...arr]);
        return w;
    }

    delete(id: string) {
        this.store.update(arr => arr.filter(w => w.id !== id));
    }
}
