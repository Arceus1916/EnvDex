# EnvDex Change Log

## Implementation Rules
- **Append Only**: Never overwrite old logs.
- **Chronological**: Keep logs in order.
- **Content**: Include timestamp, feature/module name, files affected, implementation summary, architecture decisions, and bug fixes.

---

### [2026-05-28] Initial Project Setup
**Feature**: Project Initialization & Context Creation
**Files Affected**: `package.json`, `robots.md`, `logs.md`, `implementation_details.md`, `implementation_plan.md`, `README.md`
**Summary**: 
- Initialized Expo project using SDK 56.
- Installed core dependencies: Realm, Zustand, NativeWind v4, Expo Router, Reanimated, Moti.
- Created all mandatory context files as per the TRD/PRD to ensure AI-agent maintainability and architectural consistency.
**Decisions**:
- Used NativeWind v4 for modern Tailwind support.
- Adopted Expo Router for file-based navigation.
- Moved original `.docx` design docs to a temporary `/docs` folder during initialization to avoid conflicts.

### [2026-05-28] Phase 2: Navigation & Theme System
**Feature**: Core App Routing & NativeWind Configuration
**Files Affected**: `tailwind.config.js`, `metro.config.js`, `babel.config.js`, `src/global.css`, `src/app/_layout.tsx`, `src/app/(tabs)/*`
**Summary**: 
- Reconfigured NativeWind v4 with Stitch design tokens (Ice Latte & Mint colors, Hanken Grotesk fonts).
- Removed default template tabs from SDK 56.
- Set up a standard file-based Expo Router structure using a root Stack and a nested `(tabs)` navigator.
- Created 5 basic tab screens (Home, Species, Capture, Search, Profile) styled with NativeWind to verify configuration.

### [2026-05-28] Phase 3: Local Database (Realm) & State
**Feature**: Offline-First State & Schema Setup
**Files Affected**: `src/database/schema.ts`, `src/stores/useAuthStore.ts`, `src/stores/useThemeStore.ts`, `src/app/_layout.tsx`
**Summary**: 
- Configured Zustand for local state management (Auth and Theme).
- Implemented core Realm object schemas (`User`, `SpeciesRecord`, `Observation`, `MediaAsset`, `DraftObservation`) with offline-first support.
- Initialized the `RealmProvider` at the root of the application for global database access.

### [2026-05-28] Phase 4: Authentication & Onboarding
**Feature**: Local Offline Authentication
**Files Affected**: `src/services/AuthService.ts`, `src/app/index.tsx`, `src/app/(auth)/*`
**Summary**: 
- Created `AuthService` to handle `User` schema operations via Realm.
- Generated offline Hash IDs to uniquely identify and restore local sessions.
- Built a 3-step onboarding flow (`welcome`, `category`, `permissions`).
- Built local `signup` and `login` forms utilizing the Zustand `useAuthStore` to manage session state.
- Set up root navigation redirection (`src/app/index.tsx`) based on the authenticated state.

### [2026-05-28] Phase 5: Observation Workflow
**Feature**: Core Sighting & Data Capture Workflow
**Files Affected**: `src/services/ObservationService.ts`, `src/app/observation/*`, `src/app/(tabs)/create.tsx`
**Summary**: 
- Created `ObservationService` to handle complex Realm operations: automatic species grouping, media linking, and draft management.
- Implemented `create.tsx` tab as the quick-launch entry point for the camera or gallery.
- Built `camera.tsx` using `expo-camera` and `expo-image-picker` with logic to auto-save initial media to a `DraftObservation`.
- Developed `details.tsx` form for capturing species name, field notes, and GPS location via `expo-location`.
- The workflow now robustly saves an `Observation` to Realm while optionally generating new `SpeciesRecord` entries.
