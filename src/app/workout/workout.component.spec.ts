import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { WorkoutComponent } from './workout.component';
import { WorkoutsService } from '../core/workout.service';
import { Exercise, Workout } from '../core/workout.model';

class WorkoutsServiceMock {
  private readonly workout: Workout = {
    id: 'abc',
    title: 'Treino ABC',
    createdAt: Date.now(),
    exercises: [
      { id: 'ex-1', name: 'Supino', series: '3x10', kg: 20, done: true },
      [
        { id: 'ex-2', name: 'Agachamento', series: '4x8', kg: 40, done: true },
        { id: 'ex-3', name: 'Remada', series: '3x12', kg: 15, done: false },
      ],
    ] as unknown as Workout['exercises'],
  };

  getDayById(id: string): Workout | null {
    if (id !== this.workout.id) {
      return null;
    }
    return JSON.parse(JSON.stringify(this.workout)) as Workout;
  }
}

describe('WorkoutComponent', () => {
  const activatedRouteStub = {
    snapshot: {
      paramMap: convertToParamMap({ id: 'abc' }),
    },
  };

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [WorkoutComponent],
      providers: [
        provideNoopAnimations(),
        { provide: WorkoutsService, useClass: WorkoutsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(WorkoutComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should calculate workout progress considering grouped exercises', () => {
    const fixture = TestBed.createComponent(WorkoutComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.progress()).toBe(67);
  });

  it('should flatten grouped exercises with normalizeExercises', () => {
    const fixture = TestBed.createComponent(WorkoutComponent);
    const component = fixture.componentInstance;

    const exercises = component.day()?.exercises as (Exercise | Exercise[])[];
    const normalized = component.normalizeExercises(exercises);

    expect(normalized.length).toBe(3);
    expect(normalized.every(ex => !Array.isArray(ex))).toBeTrue();
  });

  it('should persist weights resetting the done status when saving', () => {
    const fixture = TestBed.createComponent(WorkoutComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const day = component.day();
    expect(day).not.toBeNull();

    if (!day) {
      return fail('Expected workout day to be available');
    }

    const exercises = day.exercises as (Exercise | Exercise[])[];
    (exercises[0] as Exercise).done = true;
    ((exercises[1] as Exercise[])[0] as Exercise).done = true;

    component.saveKg();

    const saved = sessionStorage.getItem(day.id);
    expect(saved).not.toBeNull();

    const parsed = JSON.parse(saved!);
    expect(parsed[0].done).toBeFalse();
    expect(parsed[1][0].done).toBeFalse();
  });

  it('should format seconds into HH:MM:SS', () => {
    const fixture = TestBed.createComponent(WorkoutComponent);
    const component = fixture.componentInstance;

    expect(component.formatSecondsToHHMMSS(0)).toBe('00:00:00');
    expect(component.formatSecondsToHHMMSS(61)).toBe('00:01:01');
    expect(component.formatSecondsToHHMMSS(3661)).toBe('01:01:01');
  });
});
