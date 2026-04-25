import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Routes } from "./routes";
import { SessionProvider } from "@contexts/session";
import { PortalHost } from "@rn-primitives/portal";
import { KeyboardProvider } from "@contexts/keyboard";
import { LoadFontsProvider } from "@contexts/fonts";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: { ...DefaultTheme.colors, background: "hsl(42.86, 30.43%, 95.49%)" },
        }}
      >
        <SafeAreaProvider>
          <SessionProvider>
            <KeyboardProvider>
              <LoadFontsProvider>
                <Routes />
                <StatusBar style="light" />
                <PortalHost />
              </LoadFontsProvider>
            </KeyboardProvider>
          </SessionProvider>
        </SafeAreaProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
