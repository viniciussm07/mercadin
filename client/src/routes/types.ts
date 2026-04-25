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

export type UnauthenticatedTabParamList = {
  [UnauthenticatedRouteNames.LOGIN]: undefined;
  [UnauthenticatedRouteNames.SIGNUP]: undefined;
};

export type RootStackParamList = {
  [RootRouteNames.AUTHENTICATED]: undefined;
  [RootRouteNames.UNAUTHENTICATED]: NavigatorScreenParams<UnauthenticatedTabParamList>;
};

export type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export type UnauthenticatedNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<UnauthenticatedTabParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;
