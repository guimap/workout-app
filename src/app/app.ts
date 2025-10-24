import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';



type Kg = number | null;

interface Exercise {
  name: string;
  kg: Kg;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatToolbarModule, MatIconModule, MatButtonModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDividerModule,
    RouterOutlet, RouterLink
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Treinos';
  workoutName = 'Treino A';

  // Seção: Exercício único
  single: Exercise = { name: 'Supino reto', kg: null };

  // Seção: On-set
  onSet = signal<Exercise[]>([
    { name: 'Remada curvada', kg: null },
    { name: 'Crucifixo inclinado', kg: null },
  ]);

  addOnSet() {
    this.onSet.update(list => [...list, { name: 'Novo exercício', kg: null }]);
  }
  removeOnSet(i: number) {
    this.onSet.update(list => list.filter((_, idx) => idx !== i));
  }

  // Timer simples
  private tick?: number;
  startedAt: number | null = null;   // epoch ms
  elapsedMs = signal(0);
  running = computed(() => this.startedAt !== null);

  start() {
    if (this.startedAt !== null) return;
    this.startedAt = Date.now();
    this.tick = window.setInterval(() => {
      this.elapsedMs.set((this.elapsedMs()) + 100);
    }, 100);
  }
  pause() {
    if (this.startedAt === null) return;
    this.startedAt = null;
    if (this.tick) { clearInterval(this.tick); this.tick = undefined; }
  }
  reset() {
    this.pause();
    this.elapsedMs.set(0);
  }
  // exibe em HH:MM:SS
  get timeText(): string {
    const totalSeconds = Math.floor(this.elapsedMs() / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}
