import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#006763', // primary color from tailwind config
        tabBarInactiveTintColor: '#6d7a78', // outline color
        tabBarStyle: {
          backgroundColor: '#f7faf8',
          borderTopWidth: 1,
          borderTopColor: '#e0e3e1',
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="species"
        options={{
          title: 'Species',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Capture',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
