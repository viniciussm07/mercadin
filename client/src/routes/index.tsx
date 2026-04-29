import { useSession } from "@contexts/session";
import { RootRouteNames } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { UnauthenticatedRoutesTabs } from "./unauthenticated";
import { AuthenticatedRoutesTabs } from "./authenticated";

export const Stack = createNativeStackNavigator<RootStackParamList>();

export const Routes = () => {
  const {
    session: { isAuthenticated },
    isLoadingSession,
  } = useSession();

  if (isLoadingSession) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name={RootRouteNames.AUTHENTICATED} component={AuthenticatedRoutesTabs} />
      ) : (
        <Stack.Screen name={RootRouteNames.UNAUTHENTICATED} component={UnauthenticatedRoutesTabs} />
      )}
    </Stack.Navigator>
  );
};
