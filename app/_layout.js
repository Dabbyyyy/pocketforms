// app/_layout.js
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="forms/index" options={{ title: 'Forms' }} />
      <Stack.Screen name="forms/[id]" options={{ title: 'Form Details' }} />
      <Stack.Screen name="forms/[id]/fields" options={{ title: 'Fields' }} />
      <Stack.Screen name="forms/[id]/records" options={{ title: 'Records' }} />
      <Stack.Screen name="forms/[id]/map" options={{ title: 'Map' }} />
    </Stack>
  );
}
