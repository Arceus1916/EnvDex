import { Redirect } from 'expo-router';
import { useAuthStore } from '../stores/useAuthStore';

export default function AppEntry() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }
}
