import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/workout-list/workout-list.component')
            .then(m => m.WorkoutListComponent)
    },
    {
        path: 'workout/:id',
        loadComponent: () => import('./components/workout-detail/workout-detail.component')
            .then(m => m.WorkoutDetailComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
