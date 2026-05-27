# EnvDex: Implementation Explanation

This document explains the technical implementation of EnvDex, bridging the PRD/TRD architecture with the actual codebase. It serves as a guide for understanding how the various systems work together.

## Why This Tech Stack?
- **React Native & Expo**: Selected for its cross-platform capabilities, robust ecosystem, and rapid development workflow (file-based routing, easy permission handling).
- **Realm**: Chosen as the local database because it is an object-based database built for offline-first applications. It natively handles relationships (like Observation -> Media) efficiently.
- **Zustand**: Selected for state management over Redux because it is lightweight, modular, and requires minimal boilerplate—ideal for UI state and auth state.
- **NativeWind**: Maps the specific "Ice Latte & Mint" design tokens from the Stitch design system directly to utility classes, making UI building fast and consistent.

## Routing Architecture (Expo Router)
Navigation is entirely file-based inside the `/app` directory:
- `/(auth)` contains the login and signup flow.
- `/(tabs)` contains the main bottom navigation (Home, Species, Create, Search, Profile).
- Specific nested flows like `/observation/details.tsx` handle complex multi-step interactions.

## Database & Services (Realm)
The core logic is isolated in the `/services` folder rather than inside UI components. This ensures modularity.
- **Observations & Species**: When an observation is saved, the `SpeciesService` attempts to match the species name. If it exists, the observation is linked. Otherwise, a new `SpeciesRecord` is created.
- **Drafts**: Any incomplete observation is saved to the `DraftObservation` schema. The app checks for existing drafts on startup and prompts the user to recover them.
- **Recycle Bin**: Deleting an observation does not remove it from the database immediately. Instead, it moves to the `RecycleBin` schema with a 30-day expiration timestamp. A background or startup check cleans up expired items.

## Media Storage
When a user captures a photo or imports from the gallery:
1. The media is copied from its original location into the app's local persistent storage (`FileSystem.documentDirectory`).
2. A thumbnail is generated and cached for fast scrolling.
3. The new URIs are stored in the `MediaAsset` schema linked to the `Observation`.

## Notifications
Local notifications (`expo-notifications`) are scheduled based on user activity (e.g., "You haven't explored recently" if the last observation was >7 days ago).

## Future Synchronization
While EnvDex is currently a purely local-first app, all major Realm schemas include fields like `syncId`, `syncStatus`, and `lastSyncedAt`. This ensures that a future cloud-sync feature can be built by adding a background sync queue without requiring any schema migrations.
