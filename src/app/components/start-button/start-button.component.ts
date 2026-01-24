import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Start Button Component
 * 
 * Reusable fixed bottom button for starting/finishing workouts.
 * 
 * @Input isActive - Whether workout is currently active
 * @Output start - Emits when start button is clicked
 * @Output finish - Emits when finish button is clicked
 */
@Component({
    selector: 'app-start-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './start-button.component.html',
    styleUrl: './start-button.component.css'
})
export class StartButtonComponent {
    @Input() isActive = false;
    @Output() start = new EventEmitter<void>();
    @Output() finish = new EventEmitter<void>();

    onStart(): void {
        this.start.emit();
    }

    onFinish(): void {
        this.finish.emit();
    }
}
