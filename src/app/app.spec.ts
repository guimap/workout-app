import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';

import { AppComponent } from './app';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the toolbar brand linking to the home route', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const brandDebug = fixture.debugElement.query(By.css('mat-toolbar a.brand'));
    const brandLink = brandDebug?.nativeElement as HTMLAnchorElement | null;
    const routerLink = brandDebug?.injector.get(RouterLink, null) as (RouterLink & { commands?: unknown[] }) | null;

    expect(brandLink).not.toBeNull();
    expect(routerLink?.commands).toEqual(['/']);
    expect(brandLink?.textContent?.trim()).toBe('Treinos');
  });

  it('should render the navigation button to the home page', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const homeDebug = fixture.debugElement.query(By.css('a[mat-button]'));
    const homeButton = homeDebug?.nativeElement as HTMLAnchorElement | null;
    const routerLink = homeDebug?.injector.get(RouterLink, null) as (RouterLink & { commands?: unknown[] }) | null;

    expect(homeButton).not.toBeNull();
    expect(routerLink?.commands).toEqual(['/']);
    expect(homeButton?.textContent?.trim()).toBe('Início');
  });
});
