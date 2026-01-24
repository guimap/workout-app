import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    @Output() back = new EventEmitter<void>();

    get progressPercentage(): number {
        if (this.totalCount === 0) return 0;
        return (this.completedCount / this.totalCount) * 100;
    }

    onBack(): void {
        this.back.emit();
    }
}
