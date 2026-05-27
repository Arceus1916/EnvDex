import { Stack } from 'expo-router';

export default function ObservationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
      <Stack.Screen name="camera" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
