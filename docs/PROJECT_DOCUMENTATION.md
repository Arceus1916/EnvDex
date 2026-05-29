# EnvDex: Project Documentation

Welcome to the complete project documentation for **EnvDex**, a modern, offline-first mobile application built for naturalists, explorers, and biology enthusiasts to document local wildlife and environmental observations.

---

## 1. Project Overview
EnvDex is a robust, beautifully designed application that acts as a digital field journal. It empowers users to capture, catalog, and search their environmental observations (plants, animals, fungi) across multiple localized user profiles without needing an internet connection.

### Core Philosophy
- **Offline-First:** Built to function deep in the wilderness. The app relies on a local Realm database for data storage, removing the dependency on cloud syncing.
- **Privacy and Isolation:** Multiple users can share the same physical device, but their data is entirely sandboxed and securely isolated via a "Hash ID" login system.
- **Visual Excellence:** The UI employs a highly refined color palette, glassmorphism overlays, smooth micro-animations, and modern typography to feel premium.

---

## 2. Technology Stack
The project leverages a state-of-the-art React Native / Expo ecosystem designed for high performance, rapid iteration, and modern styling.

### Framework & Core
- **Expo (v56):** The core React Native framework used to manage native modules, building, and running the application.
- **Expo Router:** File-based routing that provides deep linking, clean navigation stacks, and a seamless transition between the Auth and Tabs flows.
- **React Native (0.85):** The underlying engine powering the cross-platform UI.

### Database & State Management
- **Realm React (`@realm/react`):** A high-performance, strictly typed mobile database used for offline storage. It provides reactive hooks (`useQuery`, `useRealm`) that automatically update the UI when the data changes.
- **Zustand:** A lightweight state management library used for the `useAuthStore` to keep track of the currently logged-in user's Hash ID without re-querying the database on every render.

### Styling & UI
- **NativeWind (Tailwind CSS for React Native):** Used for all component styling, enabling rapid UI development via utility classes.
- **React Native Reanimated & Moti:** Powers the dynamic, fluid micro-animations (e.g., glassmorphism fade-ins, skeleton loaders, and interactive button scaling).

### Media & Hardware
- **Expo Camera:** Provides a fully custom camera interface with Zoom, Flash, Video, and Grid Overlay capabilities.
- **Expo Media Library & Image Picker:** Used to access the device's gallery and save locally captured photos/videos directly to the file system.

---

## 3. Architecture & Data Flow

The application is split into two primary routing domains: `(auth)` and `(tabs)`.

### 3.1 Routing Structure
- `src/app/(auth)`: Handles user onboarding, category selection (e.g., Casual Explorer vs. Academic Researcher), permissions, and account creation/login.
- `src/app/(tabs)`: The main application shell (Bottom Tab Navigator).
  - `index.tsx`: The **Home Dashboard**. Shows recent observations, environmental streaks, and dynamic greeting cards.
  - `species.tsx`: The **Archive**. A catalog of unique species the user has documented. Automatically merges observations based on the Species Name.
  - `capture.tsx`: The gateway to the custom Camera interface.
  - `search.tsx`: A robust semantic search screen to filter observations by tags, text, and date.
  - `profile.tsx`: The user's hub for settings, statistics, and accessing the Recycle Bin.

### 3.2 Data Sandboxing (The Hash ID System)
To support multiple naturalists on one device, EnvDex uses a strict **Sandbox** approach:
1. When a user signs up, a unique 6-character alphanumeric `Hash ID` is generated.
2. This `Hash ID` is saved into `useAuthStore`.
3. Every database read (e.g., `useQuery(Observation).filtered('userId == $0', userHashId)`) forces a filter so that *only* the current user's data is ever loaded into memory.
4. When a user creates an Observation or Species Record, it is permanently tagged with their `userId`.

### 3.3 The Database Schema
The database (located in `src/database/schema.ts`) uses Realm's object-oriented schema definitions:
- **User:** Stores the Hash ID, Full Name, Category Tag, Profile Picture URI, and Password Hash.
- **SpeciesRecord:** Acts as the "Pokedex" entry. It tracks the scientific name, common name, cover media, and a counter of total observations. It is unique per user and per scientific name.
- **Observation:** The individual log of an encounter. It links to a `SpeciesRecord` and contains an array of `MediaItem` objects, location strings, timestamps, field notes, and tags. 

---

## 4. Key Features & Workflows

### The Camera & Media Processing
The `camera.tsx` file overrides the device's native camera app to provide a tailored wildlife capture experience. 
- It handles permissions securely.
- It dynamically unmounts when the user navigates away to prevent hardware locks.
- Once a photo/video is captured, the `ObservationService` immediately writes a "draft" to the Realm database and navigates the user to the `details.tsx` screen to fill out metadata (notes, tags, species name).

### Automatic Species Merging
When an observation is saved:
1. The app checks if the provided "Species Name" already exists in the user's sandbox.
2. If it does, the new Observation is linked to the existing `SpeciesRecord`, and the `totalObservations` count increments.
3. If it does not, a brand new `SpeciesRecord` card is minted for the Archive.

### The Recycle Bin (Soft Deletion)
To prevent accidental data loss in the field, EnvDex uses a soft-deletion mechanism.
- When an observation is "deleted", its `deletedStatus` flag is flipped to `true`, and it receives a `recycleBinTimestamp`.
- It immediately disappears from the Home and Archive feeds.
- The user can navigate to Profile > Recycle Bin to permanently destroy the data or restore it to their main feed.

---

## 5. Security & Validation
While EnvDex is an offline app, data integrity is strictly enforced:
- **Username Uniqueness:** At signup, the database verifies no other user on the device has the exact same username (case-insensitive).
- **Password Strength:** Passwords are validated locally to ensure a minimum of 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.
- **Permissions:** The app gracefully handles scenarios where users deny Camera or Photo Library access, providing custom fallback UI to re-request them.

---

## 6. Future Expansion Points
- **Cloud Syncing:** Because the data is modeled relationally via Realm, it is perfectly positioned to integrate MongoDB Device Sync in the future if cloud backups are requested.
- **AI Species Identification:** The `Observation` schema can be easily expanded to include an `aiConfidence` score or `suggestedSpecies` array if an offline CoreML/TensorFlow Lite model is added.
- **GPS Coordinates:** The schema currently supports a `locationText` string. This can be expanded to store exact latitude/longitude tuples for map-based visualizations.
