# EnvDex Implementation Plan

This file tracks phased development execution.
**VERY IMPORTANT RULE: NEVER overwrite this file completely.**
Append new implementation phases under dated headings, milestone sections, or module sections.

## [2026-05-28] Initial Architecture Phase

### Phase 1: Initial Setup & Context Files (In Progress)
- [x] Create temporary `/docs` folder for legacy design `.docx` files.
- [x] Initialize Expo project with React Native, TypeScript, and Expo Router.
- [x] Install Realm, Zustand, NativeWind, Reanimated, and other core libraries.
- [x] Setup `robots.md`
- [x] Setup `logs.md`
- [x] Setup `implementation_details.md`
- [x] Setup `README.md`
- [x] Setup `implementation_plan.md` (this file)

### Phase 2: Navigation & Theme System (Completed)
- [x] Configure `_layout.tsx` for core app routing.
- [x] Build basic bottom tab navigation UI for Home, Species, Create, Search, and Profile.
- [x] Initialize NativeWind and map Stitch design tokens to `tailwind.config.js`.

### Phase 3: Local Database (Realm) & State (Completed)
- [x] Define Realm Schemas (`User`, `SpeciesRecord`, `Observation`, `MediaAsset`, `DraftObservation`, etc.).
- [x] Initialize Realm provider in Expo.
- [x] Create basic Zustand stores (`useAuthStore`, `useThemeStore`).

### Phase 4: Authentication & Onboarding (Completed)
- [x] Welcome Screen
- [x] Category Selection
- [x] Local Login / Signup forms.
- [x] Connect Authentication to Realm `User` schema.

### Phase 5: Observation Workflow (Completed)
- [x] Camera and Gallery Media Capture.
- [x] Draft auto-saving and recovery logic.
- [x] Observation Form Details (Notes, Name, Location).

### Phase 6: Species Grouping & Archive (Pending)
- [ ] Species matching algorithm.
- [ ] Species Explorer screens.

### Phase 7: Search, Notifications & Recycle Bin (Pending)
- [ ] Local search logic.
- [ ] Notifications scheduling.
- [ ] Soft deletion and Recycle bin recovery.

### Phase 8: Polish & APK Build (Pending)
- [ ] Performance testing and indexing optimizations.
- [ ] Prepare APK build process.
