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
