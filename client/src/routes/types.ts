import type { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

export enum RootRouteNames {
  AUTHENTICATED = "Authenticated",
  UNAUTHENTICATED = "Unauthenticated",
}

export enum UnauthenticatedRouteNames {
  LOGIN = "Login",
  SIGNUP = "Signup",
}

export enum AuthenticatedRouteNames {
  DASHBOARD = "Dashboard",
  MY_LISTS = "MyLists",
  PROMOTIONS = "Promotions",
  SEARCH_ITEMS = "SearchItems",
}

export enum AuthenticatedStackRouteNames {
  TABS = "AuthenticatedTabs",
  SHOPPING_LIST_DETAILS = "ShoppingListDetails",
  USER_SETTINGS = "UserSettings",
}

export type UnauthenticatedTabParamList = {
  [UnauthenticatedRouteNames.LOGIN]: undefined;
  [UnauthenticatedRouteNames.SIGNUP]: undefined;
};

export type AuthenticatedTabParamList = {
  [AuthenticatedRouteNames.DASHBOARD]: undefined;
  [AuthenticatedRouteNames.MY_LISTS]: undefined;
  [AuthenticatedRouteNames.PROMOTIONS]: undefined;
  [AuthenticatedRouteNames.SEARCH_ITEMS]: undefined;
};

export type AuthenticatedStackParamList = {
  [AuthenticatedStackRouteNames.TABS]: NavigatorScreenParams<AuthenticatedTabParamList>;
  [AuthenticatedStackRouteNames.SHOPPING_LIST_DETAILS]: { listId: string };
  [AuthenticatedStackRouteNames.USER_SETTINGS]: undefined;
};

export type RootStackParamList = {
  [RootRouteNames.AUTHENTICATED]: NavigatorScreenParams<AuthenticatedStackParamList>;
  [RootRouteNames.UNAUTHENTICATED]: NavigatorScreenParams<UnauthenticatedTabParamList>;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export type UnauthenticatedNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<UnauthenticatedTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type AuthenticatedNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<AuthenticatedTabParamList>,
  CompositeNavigationProp<
    NativeStackNavigationProp<AuthenticatedStackParamList>,
    NativeStackNavigationProp<RootStackParamList>
  >
>;
