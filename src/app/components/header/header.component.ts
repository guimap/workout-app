import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings.service';

/**
 * Header Component
 * 
 * Reusable header for workout detail pages with back button,
 * title, progress information, and optional timer.
 * 
 * @Input title - Workout name
 * @Input completedCount - Number of completed exercises
 * @Input totalCount - Total number of exercises
 * @Input timer - Formatted timer string (optional)
 * @Input showTimer - Whether to show timer badge
 * @Output back - Emits when back button is clicked
 */
@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent {
    @Input() title = '';
    @Input() completedCount = 0;
    @Input() totalCount = 0;
    @Input() timer = '00:00';
    @Input() showTimer = false;
    @Input() volume: string | null = null;
    @Output() back = new EventEmitter<void>();

    settingsService = inject(SettingsService);

    showTooltip = false;
    private touchTimeout: any;

    get progressPercentage(): number {
        if (this.totalCount === 0) return 0;
        return (this.completedCount / this.totalCount) * 100;
    }

    onBack(): void {
        this.back.emit();
    }

    checkTruncationAndShow(element: HTMLElement): void {
        if (element.scrollWidth > element.clientWidth) {
            this.showTooltip = true;
        }
    }

    hideTooltip(): void {
        this.showTooltip = false;
    }

    onTouchStart(element: HTMLElement): void {
        if (element.scrollWidth <= element.clientWidth) return;

        this.touchTimeout = setTimeout(() => {
            this.showTooltip = true;
        }, 450);
    }

    onTouchEnd(): void {
        clearTimeout(this.touchTimeout);
        // Fallback tap: se soltar rápido e formos mobile, toggle.
        // Como 'mouseenter' não dispara sempre no mobile touch,
        // gerenciaremos o toggle via click nativo amarrado no template para fallback.
    }

    toggleTooltip(element: HTMLElement): void {
        if (element.scrollWidth > element.clientWidth) {
            this.showTooltip = !this.showTooltip;

            if (this.showTooltip) {
                // Auto-hide depois de um tempo no touch
                setTimeout(() => {
                    this.showTooltip = false;
                }, 3000);
            }
        }
    }
}
