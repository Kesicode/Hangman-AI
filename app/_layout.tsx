import { Stack } from "expo-router";

// Import your global CSS file
import "../global.css";
import Header from "@/components/Header";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

export default function RootLayout() {
  const theme = useColorScheme();
  return (
    <>
      <StatusBar animated translucent={false} backgroundColor="#dda15e" />
      <Stack
        screenOptions={{
          // headerShown: false,
          header: () => <Header />,
          contentStyle: {
            backgroundColor: theme.colorScheme === "dark" ? "#000" : "#fff",
          },
        }}
      ></Stack>
    </>
  );
}
