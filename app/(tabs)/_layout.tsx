import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

function TabBarIcon({ name, color }: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={25} style={{ marginBottom: -3 }} name={name} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', // Positionner la tab bar en absolu pour iOS
          },
          default: {},
        }),
      }}
    >
      {/* Écran "Add Product" */}
      <Tabs.Screen
        name="index"  // Ce nom correspond à `app/tabs/index.tsx` (si ce fichier existe)
        options={{
          title: 'Add Product',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'add' : 'add-outline'} color={color} />
          ),
        }}
      />
      
      {/* Écran "View Products" */}
      <Tabs.Screen
        name="explore"  // Ce nom correspond à `app/tabs/explore.tsx` (si ce fichier existe)
        options={{
          title: 'View Products',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'eye' : 'eye-outline'} color={color} />
          ),
        }}
      />
      
      {/* Écran "Map" */}
      <Tabs.Screen
        name="map"  // Correspond à `app/screens/Map.tsx`
        options={{
          title: 'Navigation',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
