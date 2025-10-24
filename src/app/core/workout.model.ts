export interface Exercise {
    id: string;
    name: string;
    series: string;
    kg: number | null;
    done: boolean;
}
export interface Workout {
    id: string;
    title: string;
    notes?: string;
    exercises: Exercise[] | Exercise[][];
    createdAt: number;
}
