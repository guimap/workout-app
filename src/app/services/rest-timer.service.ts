import { Injectable, signal, computed } from '@angular/core';

export const DEFAULT_REST_SECONDS = 30;

@Injectable({
    providedIn: 'root'
})
export class RestTimerService {
    // State
    private timeRemainingSignal = signal<number>(0);
    private isRunningSignal = signal<boolean>(false);
    private isVisibleSignal = signal<boolean>(false);

    // Public API
    readonly timeRemaining = computed(() => this.timeRemainingSignal());
    readonly isRunning = computed(() => this.isRunningSignal());
    readonly isVisible = computed(() => this.isVisibleSignal());

    // Internal timer reference
    private timerInterval: any = null;
    private targetTime: number = 0;

    /**
     * Inicia ou reinicia o timer de descanso.
     */
    startTimer(seconds: number = DEFAULT_REST_SECONDS): void {
        this.clearTimer();
        this.timeRemainingSignal.set(seconds);
        this.targetTime = Date.now() + seconds * 1000;
        this.isRunningSignal.set(true);
        this.isVisibleSignal.set(true);

        this.timerInterval = setInterval(() => {
            // Calcula com base no tempo real para prevenir interrupção quando navegador é minimizado no mobile
            const remaining = Math.max(0, Math.ceil((this.targetTime - Date.now()) / 1000));
            this.timeRemainingSignal.set(remaining);

            if (remaining <= 0) {
                this.clearTimer();
                // Play a sound or auto-close?
                // Let's keep it visible at 00:00 or auto-close after 3s
                setTimeout(() => this.closeTimer(), 3000);
            }
        }, 1000);
    }

    pauseTimer(): void {
        this.clearTimer();
        this.isRunningSignal.set(false);
    }

    resumeTimer(): void {
        if (!this.isRunningSignal() && this.timeRemainingSignal() > 0) {
            this.startTimer(this.timeRemainingSignal());
        }
    }

    addTime(seconds: number): void {
        const newTime = this.timeRemainingSignal() + seconds;
        this.timeRemainingSignal.set(newTime);
        if (this.isRunningSignal()) {
            this.targetTime += seconds * 1000;
        }
    }

    closeTimer(): void {
        this.clearTimer();
        this.isVisibleSignal.set(false);
        this.timeRemainingSignal.set(0);
        this.isRunningSignal.set(false);
    }

    private clearTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}
