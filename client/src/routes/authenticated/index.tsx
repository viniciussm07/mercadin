import { Text } from "@components/text";
import { BottomTab } from "@layout/bottom-tab";
import { HeaderTabBar } from "@layout/header-tab-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthenticatedRouteNames, AuthenticatedTabParamList } from "@routes/types";
import { Dimensions, Platform } from "react-native";

const Tab = createBottomTabNavigator<AuthenticatedTabParamList>();
const isWeb = Platform.OS === "web" && Dimensions.get("window").width >= 768;

export const AuthenticatedRoutesTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => (isWeb ? <HeaderTabBar {...props} /> : <BottomTab {...props} />)}
      screenOptions={{
        headerShown: false,
        tabBarPosition: isWeb ? "top" : "bottom",
      }}
    >
      <Tab.Screen
        name={AuthenticatedRouteNames.DASHBOARD}
        options={{ tabBarLabel: "Dashboard" }}
        component={() => <Text>Dashboard</Text>}
      />
    </Tab.Navigator>
  );
};
