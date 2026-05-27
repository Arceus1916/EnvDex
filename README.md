# EnvDex: Premium Biodiversity Journal

![Screenshot Placeholder](placeholder)

EnvDex is a local-first personal nature observation app that helps you capture, organize, and revisit flora and fauna sightings in a structured and visually rich way. It functions as your personal Pokedex for nature encounters.

## Tech Stack
- **Frontend**: React Native, Expo, TypeScript
- **Navigation**: Expo Router
- **Database**: Realm (Offline-First)
- **State Management**: Zustand
- **Styling**: NativeWind (Tailwind CSS)
- **Animations**: React Native Reanimated, Moti

## Architecture Overview
The app uses a modular, local-first architecture ensuring seamless offline functionality. All observations, media assets, and species groups are stored in Realm, while media files are securely persisted in local device storage. The system is designed to be easily extensible for future cloud synchronization and AI integration.

## Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npx expo start
   ```
4. **Run on a device or emulator**:
   Press `a` for Android, or `i` for iOS (requires macOS).

## Android Build (APK Generation)
To generate an installable APK for Android devices:
1. Make sure you have an Expo account and EAS CLI installed (`npm install -g eas-cli`).
2. Log in to your account: `eas login`
3. Build the APK locally or via EAS:
   ```bash
   eas build -p android --profile preview
   ```
*(Local APK generation instructions to be finalized)*

## Folder Structure
- `/app` - Application routes and screens
- `/components` - Reusable UI components
- `/services` - Business logic (Realm, Auth, Media)
- `/database` - Realm schemas
- `/constants` - Design tokens and theme settings

## Features
- **Local Authentication**: Secure isolated profiles.
- **Observation Creation**: Rich media, GPS, and manual tagging.
- **Species Grouping**: Automatically group sightings into a species archive.
- **Drafts & Recycle Bin**: Never lose an in-progress capture, recover deleted items for 30 days.

## Contribution & Future Features
(Future features placeholder: Cloud Sync, AI Image Recognition)

## License
MIT (Placeholder)
