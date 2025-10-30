import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { WorkoutsService } from '../core/workout.service';
import { Workout } from '../core/workout.model';
import { HomeComponent } from './home.component';

class WorkoutsServiceStub {
  private readonly store = signal<Workout[]>([
    { id: 'A', title: 'Treino A', createdAt: Date.now(), exercises: [] as unknown as Workout['exercises'] },
    {
      id: 'B',
      title: 'Treino B',
      createdAt: Date.now(),
      exercises: [
        { id: 'b1', name: 'Agachamento', series: '3x10', kg: null, done: false },
        [
          { id: 'b2', name: 'Supino', series: '3x10', kg: null, done: true },
          { id: 'b3', name: 'Remada', series: '3x10', kg: null, done: false },
        ],
      ] as unknown as Workout['exercises'],
    },
  ]);

  list = this.store.asReadonly();

  addBlank = jasmine.createSpy('addBlank');
  delete = jasmine.createSpy('delete');
  reload = jasmine.createSpy('reload');
}

describe('HomeComponent', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let service: WorkoutsServiceStub;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideNoopAnimations(),
        { provide: WorkoutsService, useClass: WorkoutsServiceStub },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    service = TestBed.inject(WorkoutsService) as unknown as WorkoutsServiceStub;
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render a card for each workout provided by the service', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('mat-card.workout');

    expect(cards.length).toBe(service.list().length);
  });

  it('should filter workouts by query text (case insensitive)', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    expect(component.filtered().length).toBe(service.list().length);

    component.query = 'treino b';
    expect(component.filtered().map(w => w.id)).toEqual(['B']);

    component.query = '   ';
    expect(component.filtered().length).toBe(service.list().length);
  });

  it('should calculate progress for nested workout structures', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    const nested = [
      { done: true } as any,
      [{ done: true }, { done: false }] as any,
    ];

    expect(component.progressOf(nested)).toBe(67);
  });

  it('should reload workouts when retry is called', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;

    component.retry();

    expect(service.reload).toHaveBeenCalled();
  });
});
