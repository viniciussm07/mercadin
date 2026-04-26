import { HeaderMobile } from "@layout/header-mobile";
import { TabBar } from "@layout/tab-bar";
import { Home } from "@pages/home";
import { MyLists } from "@pages/my-lists";
import { Promotions } from "@pages/promotions";
import { SearchItems } from "@pages/search-items";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthenticatedRouteNames, AuthenticatedTabParamList } from "@routes/types";
import { env } from "@utils/environment";

const Tab = createBottomTabNavigator<AuthenticatedTabParamList>();

export const AuthenticatedRoutesTabs = () => {
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
        name={AuthenticatedRouteNames.DASHBOARD}
        options={{ tabBarLabel: "Início" }}
        component={Home}
      />
      <Tab.Screen
        name={AuthenticatedRouteNames.MY_LISTS}
        options={{ tabBarLabel: "Listas" }}
        component={MyLists}
      />
      <Tab.Screen
        name={AuthenticatedRouteNames.PROMOTIONS}
        options={{ tabBarLabel: "Promoções" }}
        component={Promotions}
      />
      <Tab.Screen
        name={AuthenticatedRouteNames.SEARCH_ITEMS}
        options={{ tabBarLabel: "Buscar" }}
        component={SearchItems}
      />
    </Tab.Navigator>
  );
};
