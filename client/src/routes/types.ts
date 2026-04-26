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

export type RootStackParamList = {
  [RootRouteNames.AUTHENTICATED]: NavigatorScreenParams<AuthenticatedTabParamList>;
  [RootRouteNames.UNAUTHENTICATED]: NavigatorScreenParams<UnauthenticatedTabParamList>;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export type UnauthenticatedNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<UnauthenticatedTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

export type AuthenticatedNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<AuthenticatedTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
