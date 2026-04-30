import { HeaderMobile } from "@layout/header-mobile";
import { TabBar } from "@layout/tab-bar";
import { Home } from "@pages/home";
import { MyLists } from "@pages/my-lists";
import { Promotions } from "@pages/promotions";
import { SearchItemsPage } from "@pages/search-items";
import { ShoppingListDetails } from "@pages/my-lists/pages/shopping-list-details";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AuthenticatedRouteNames,
  AuthenticatedStackParamList,
  AuthenticatedStackRouteNames,
  AuthenticatedTabParamList,
} from "@routes/types";
import { env } from "@utils/environment";

const Tab = createBottomTabNavigator<AuthenticatedTabParamList>();
const Stack = createNativeStackNavigator<AuthenticatedStackParamList>();

export const AuthenticatedRoutesTabs = () => {
  return (
    <Tab.Navigator
      tabBar={TabBar}
      screenOptions={{
        header: !env.isWeb ? props => <HeaderMobile {...props} /> : undefined,
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
        options={{ tabBarLabel: "Buscar", headerShown: false }}
        component={SearchItemsPage}
      />
    </Tab.Navigator>
  );
};

export const AuthenticatedRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AuthenticatedStackRouteNames.TABS} component={AuthenticatedRoutesTabs} />
      <Stack.Screen
        name={AuthenticatedStackRouteNames.SHOPPING_LIST_DETAILS}
        component={ShoppingListDetails}
      />
    </Stack.Navigator>
  );
};
