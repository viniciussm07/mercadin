import { BottomTab } from "@layout/bottom-tab";
import { HeaderTabBar } from "@layout/header-tab-bar";
import { SignIn } from "@pages/auth/signin";
import { SignUp } from "@pages/auth/signup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UnauthenticatedRouteNames, UnauthenticatedTabParamList } from "@routes/types";
import { Dimensions, Platform } from "react-native";

const Tab = createBottomTabNavigator<UnauthenticatedTabParamList>();
const isWeb = Platform.OS === "web" && Dimensions.get("window").width >= 768;

export const UnauthenticatedRoutesTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => (isWeb ? <HeaderTabBar {...props} /> : <BottomTab {...props} />)}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isWeb ? "top" : "bottom",
      }}
    >
      <Tab.Screen
        name={UnauthenticatedRouteNames.LOGIN}
        options={{ tabBarLabel: "Entrar" }}
        component={SignIn}
      />
      <Tab.Screen
        name={UnauthenticatedRouteNames.SIGNUP}
        options={{ tabBarLabel: "Criar conta" }}
        component={SignUp}
      />
    </Tab.Navigator>
  );
};
