import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/translation Mode" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/settings" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/profile" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/signdetails" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/signtotext" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/texttosign" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/history" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/alphabet" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/login" options={{ headerShown: false }} />
      <Stack.Screen name="prototype/texttovoice" options={{ headerShown: false }} />
    </Stack>
  );
}