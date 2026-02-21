import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home.component')
            .then(m => m.HomeComponent)
    },
    {
        path: 'workout/:id',
        loadComponent: () => import('./pages/detail/detail.component')
            .then(m => m.DetailComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
