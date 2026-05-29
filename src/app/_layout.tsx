import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RealmProvider } from '@realm/react';
import { realmSchemas } from '../database/schema';

export default function RootLayout() {
  return (
    <RealmProvider schema={realmSchemas} schemaVersion={5} deleteRealmIfMigrationNeeded={true}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </RealmProvider>
  );
}
