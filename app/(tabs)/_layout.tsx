import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        animation: 'none',  
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="Map" />
      <Stack.Screen name="Search" />
      <Stack.Screen name="Messages" />
    </Stack>
  );
}
