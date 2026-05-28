import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

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
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="species"
        options={{
          title: 'Species',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="leaf" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="camera" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
