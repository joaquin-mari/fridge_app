import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="tabs" options={{ headerShown: false }} />
        {/* Add other non-tab routes here */}
      </Stack>
    </SafeAreaProvider>
  );
}
