import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    template: `
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class AppComponent { }
