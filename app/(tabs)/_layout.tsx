import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Masquer les en-têtes par défaut
        animation: 'none',  // Désactiver toutes les animations
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Map" />
      <Stack.Screen name="Search" />
      <Stack.Screen name="Messages" />
    </Stack>
  );
}
