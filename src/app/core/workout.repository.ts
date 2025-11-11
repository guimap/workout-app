import { Injectable } from "@angular/core";
import { Exercise, Workout } from "./workout.model";

@Injectable({ providedIn: 'root' })
export class WorkoutsRepository {
    async save(id: string, exercises: Exercise[] | Exercise[][]): Promise<void> {
        const state = JSON.stringify(exercises);
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
        localStorage.setItem(id, JSON.stringify(cloned));
    }

    async get(id: string): Promise<Workout | null> {
        const localState = await localStorage.getItem(id);
        if (!localState) return null;
        const exercises: Exercise[] | Exercise[][] = JSON.parse(localState) as Exercise[] | Exercise[][];

        return {
            id,
            title: '',
            createdAt: new Date().getTime(),
            exercises: exercises || []
        }
    }

}