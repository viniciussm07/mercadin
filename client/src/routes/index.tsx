import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../pages/home";
import { RouteNames } from "./types";

const Stack = createNativeStackNavigator();

export const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name={RouteNames.HOME} component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
