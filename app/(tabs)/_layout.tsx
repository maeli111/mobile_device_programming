import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';


import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // Assurez-vous d'installer @expo/vector-icons

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
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
 name="index"
 options={{
 title: 'Add Product',
 tabBarIcon: ({ color, focused }) => (
 <TabBarIcon name={focused ? 'add' : 'add-outline'} color={color} />
 ),
 }}
 />
 <Tabs.Screen
 name="explore"
 options={{
 title: 'View Products',
 tabBarIcon: ({ color, focused }) => (
 <TabBarIcon name={focused ? 'eye' : 'eye-outline'} color={color} />
 ),
 }}
 />
    </Tabs>
  );
}
