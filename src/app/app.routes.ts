import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { WorkoutComponent } from "./workout/workout.component";

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Meus Treinos' },
    { path: 'treino/:id', component: WorkoutComponent, title: 'Treino' },
    { path: '**', redirectTo: '' }
];
