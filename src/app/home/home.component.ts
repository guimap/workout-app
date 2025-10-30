import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { WorkoutsService } from '../core/workout.service';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule, RouterModule, FormsModule,
        MatCardModule, MatButtonModule, MatIconModule,
        MatChipsModule, MatProgressBarModule,
        MatFormFieldModule, MatInputModule
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    private router = inject(Router);
    svc = inject(WorkoutsService);

    query = '';

    /** Lista filtrada reativa (recalcula quando query ou lista mudarem) */
    filtered = computed(() => {
        const q = this.query.trim().toLowerCase();
        const items = this.svc.list();
        if (!q) return items;
        return items.filter(w =>
            w.title?.toLowerCase().includes(q) ||
            w.id?.toLowerCase().includes(q)
        );
    });

    /** trackBy para performance em *ngFor */
    trackById = (_: number, w: { id: string }) => w.id;

    progressOf(exs: { done?: boolean }[] | { done?: boolean }[][] = []) {
        if (!exs.length) return 0;

        const flattened = (exs as any[]).flat ? (exs as any[]).flat(Infinity) : exs;
        const total = flattened.length;
        if (!total) return 0;

        const done = flattened.filter((e: { done?: boolean }) => e?.done).length;
        return Math.round((done / total) * 100);
    }

    addWorkout() {
        const w = this.svc.addBlank();         // cria local (rascunho)
        this.router.navigate(['/treino', w.id]);
    }

    remove(id: string) {
        this.svc.delete(id);
    }

    retry() {
        this.svc.reload();
    }
}
