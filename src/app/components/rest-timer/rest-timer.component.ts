import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestTimerService } from '../../services/rest-timer.service';

@Component({
    selector: 'app-rest-timer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rest-timer.component.html',
    styleUrl: './rest-timer.component.css'
})
export class RestTimerComponent {
    restTimerService = inject(RestTimerService);

    formattedTime = computed(() => {
        const totalSeconds = this.restTimerService.timeRemaining();
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    });

    togglePlayPause(): void {
        if (this.restTimerService.isRunning()) {
            this.restTimerService.pauseTimer();
        } else {
            this.restTimerService.resumeTimer();
        }
    }

    add30s(): void {
        this.restTimerService.addTime(30);
    }

    close(): void {
        this.restTimerService.closeTimer();
    }
}
