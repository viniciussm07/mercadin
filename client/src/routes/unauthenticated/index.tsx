import { HeaderMobile } from "@layout/header-mobile";
import { TabBar } from "@layout/tab-bar";
import { SignIn } from "@pages/auth/signin";
import { SignUp } from "@pages/auth/signup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { UnauthenticatedRouteNames, UnauthenticatedTabParamList } from "@routes/types";
import { env } from "@utils/environment";

const Tab = createBottomTabNavigator<UnauthenticatedTabParamList>();

export const UnauthenticatedRoutesTabs = () => {
  return (
    <Tab.Navigator
      tabBar={TabBar}
      screenOptions={{
        header: !env.isWeb ? HeaderMobile : undefined,
        headerShown: !env.isWeb,
        tabBarPosition: env.isWeb ? "top" : "bottom",
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
