# Changelog

All notable changes to this project will be documented in this file.

## [2.0.3] - 2026-02-20

### Fixed
- **Rest Timer Scope:** Prevented the automatic Rest Timer modal from persistently surviving screen destructions. The `RestTimerService` is now explicitly closed within `DetailComponent.ngOnDestroy`, restricting the timer to the active workout session's lifecycle.
- **UI Symmetry (Single Set):** Adjusted `exercise-item.component.css` to inject `min-width` and symmetric lateral padding into the base `.weight-value` class, correcting the visually collapsed alignment of single-set input displays (e.g., Supino Inclinado) relative to adjacent multi-set inputs.
- **CI/CD Automation:** Added the Release and QA bots locally acting as an automated GitHub Tag publication pipeline.

---

## [2.0.2] - 2026-02-20

### Fixed
- **Personal Record Calculation:** Fixed a bug where saving a lower weight in a subsequent set would incorrectly override the session's overall maximum weight in the historical PR database. The `WorkoutStorageRepository` now intelligently computes the maximum weight dynamically across all sets for the given session to prevent false-positive PR badge states.

---

## [2.0.1] - 2026-02-20

### Added
- **Motion System Framework:** Smooth CSS transitions via central tokens (`--motion-expand`, `--ease-standard`, etc.), enabling fluid UI navigations. Added accessibility support through `prefers-reduced-motion`.
- **Automatic Rest Timer:** Non-blocking floating 30s rest timer (`RestTimerComponent` & `RestTimerService`) automatically triggered upon set completion or manually via the new "Descanso 30s" button.
- **Unit Toggle System (kg/lb):** Real-time formatting feature allowing users to swap between Kilograms and Pounds dynamically without interrupting the logging flow or reloading the page. Underlying canonical storage safely persists to `kg`.
- **Previous Session History Log:** `ExerciseItemComponent` now surfaces historical logging context ("Anterior: X kg"), pulling directly from `WorkoutStorageRepository`.
- **Personal Record (PR) Badges:** Visually highlights a weight entry if it surpasses the user's historical personal best.
- **Active Session Volume Display:** Expanded header logic accurately calculates and presents the total lifted volume continuously throughout the session.
- **Title Truncation Tooltip:** Desktop (hover) and Mobile (touch-and-hold) support to intuitively display long workout titles originally hidden by ellipsis overflow.

### Changed
- Increased application resilience against browser background suspension specifically for ongoing timers (`Date.now()` delta architecture).
- Refined End-to-End (E2E) testing framework documentation adding journeys J7 through J11 to validate the new P0 features.

### Fixed
- Addressed duplicate `countTotalExercises` imports in `DetailComponent`.
- Included standard `appearance` configurations inside global `styles.css` removing browser rendering warnings.

---

## [1.0.0] - Initial Release
- Core Treino App architecture.
- Workouts logging, basic local storage persistence, responsive UI layout.
