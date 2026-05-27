# EnvDex: AI-Agent Context & Memory

## Project Overview
EnvDex is a premium local-first biodiversity journaling and species observation mobile application. It acts as a digital field journal and personal species memory system, allowing users to capture sightings, add context (time, location, notes), and group them into structured species records.

## Architecture Summary
- **Frontend**: React Native, Expo, TypeScript, Expo Router
- **State Management**: Zustand
- **Database**: Realm Database (local-first)
- **Styling**: NativeWind (Tailwind), React Native Reanimated, Moti
- **Storage**: Local file persistence (Expo File System, Expo Image Picker, Camera)

## Active Stack
- React Native & Expo SDK 56
- Realm
- Zustand
- NativeWind v4 & TailwindCSS v3
- Expo Router
- Reanimated 3 & Moti
- React Hook Form & Zod

## Folder Structure
```
/app
  /(auth)         - Authentication screens
  /(tabs)         - Main bottom tab navigation
  /observation    - Observation specific flows (create, edit, details)
  /species        - Species archive flows
  /settings       - User preferences
  /modals         - Transparent/Sheet modals
/components       - Reusable UI elements (cards, buttons, inputs)
/services         - Business logic (Realm operations, auth, media)
/database         - Realm schema definitions
/hooks            - Custom React hooks
/stores           - Zustand global state stores
/utils            - Helper functions
/constants        - Colors, typography, spacing (Stitch tokens)
/types            - TypeScript definitions
```

## Implementation Rules (Anti-Hallucination)
1. **Preserve Architecture**: Do NOT randomly refactor or rewrite the core architecture without explicit reason.
2. **Local-First**: All MVP functionality MUST work completely offline. No mandatory cloud dependency.
3. **Observation-Centric**: Every sighting is an `Observation`, grouped under a `SpeciesRecord`.
4. **Modularity**: Keep business logic in `/services`, separate from UI components.
5. **No Placeholders**: Never use hardcoded placeholders in production UI if actual data or a functional component can be generated.

## Design System Rules
- **Theme**: "Ice Latte & Mint" (Modern Corporate + Tactile/Glassmorphic)
- **Primary Color**: Deep Teal/Mint (`#00a19b` / `#006763`)
- **Secondary Color**: Ice Latte (`#f7faf8` / `#e9e1d7`)
- **Typography**: Hanken Grotesk (Scientific precision, monospaced-adjacent clarity)
- **Shapes**: `rounded-2xl` for modules, `rounded-3xl` for hero cards, `rounded-full` for interactive elements (buttons, tags).

## Navigation Structure
- **Launch/Onboarding**: Splash -> Welcome -> Category -> Permissions
- **Auth Layer**: Login -> Signup -> Hash ID Modal
- **Main App (Tabs)**: Home, Species, Create Observation, Search, Profile

## Realm Schema Summaries
- **User**: Authentication, hash ID, preferences.
- **SpeciesRecord**: Grouping entity (common name, scientific name, cover media).
- **Observation**: A single sighting event (location, timestamp, notes, tags).
- **MediaAsset**: Linked to an Observation. Stores local URIs and thumbnails.
- **DraftObservation**: Temporary storage for interrupted captures.
- **Notification**: Scheduled or triggered reminders.
- **RecycleBin**: 30-day retention for soft-deleted items.

## Service Architecture Summaries
- `AuthService`: Local account management and session checking.
- `ObservationService`: CRUD for observations and drafts.
- `SpeciesService`: Matching and grouping algorithms.
- `MediaService`: Handling gallery imports, camera capture, thumbnail generation, and app-storage copying.
- `StorageService`: Cleanup and metrics.

## Storage Rules
- Media must be copied into dedicated app directories (e.g., `/app-storage/users/user-id/images`).
- Thumbnails are generated locally.
- Do NOT rely on original gallery URIs (they can be deleted).

## Current Implementation Status
- `[ ]` Setup & Context Files
- `[ ]` Navigation & Theme
- `[ ]` Realm Schemas
- `[ ]` Authentication
- `[ ]` Observation Workflow
- `[ ]` Species Archive
- `[ ]` Search & Discovery
- `[ ]` Notifications & Recycle Bin

## Future-Ready Systems (Sync Architecture Placeholders)
- Entities include `syncId`, `syncStatus`, and `lastSyncedAt` to prepare for future cloud synchronization.
- AI Metadata placeholders exist for future image recognition (e.g., `aiConfidenceScore`).

## AI-Agent Workflow Instructions
- **Read before acting**: Always check `robots.md` and `logs.md` before implementing a new module.
- **Append, don't overwrite**: When completing a feature, append to `logs.md` and update status in `robots.md`.
