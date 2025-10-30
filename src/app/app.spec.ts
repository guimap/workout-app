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
    const compiled = fixture.nativeElement as HTMLElement;
    const brandLink = compiled.querySelector('mat-toolbar a.brand');

    expect(brandLink).not.toBeNull();
    expect(brandLink?.getAttribute('ng-reflect-router-link')).toBe('/');
    expect(brandLink?.textContent?.trim()).toBe('Treinos');
  });

  it('should render the navigation button to the home page', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const homeButton = compiled.querySelector('a[mat-button][routerLink="/"]');

    expect(homeButton).not.toBeNull();
    expect(homeButton?.textContent?.trim()).toBe('Início');
  });
});
