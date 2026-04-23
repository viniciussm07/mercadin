import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../pages/home";
import { RootStackParamList, RouteNames } from "./types";
import { Login } from "@pages/login";
import { MainLayout } from "@layout/main-layout";
import { SignUp } from "@pages/signup";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Routes = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      layout={({ children }) => <MainLayout children={children} />}
    >
      <Stack.Screen name={RouteNames.HOME} component={Home} />
      <Stack.Screen name={RouteNames.LOGIN} component={Login} />
      <Stack.Screen name={RouteNames.SIGNUP} component={SignUp} />
    </Stack.Navigator>
  );
};
