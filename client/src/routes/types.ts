export enum RouteNames {
  HOME = "Home",
  LOGIN = "Login",
  SIGNUP = "Signup",
}

export type RootStackParamList = {
  [RouteNames.HOME]: undefined;
  [RouteNames.LOGIN]: undefined;
  [RouteNames.SIGNUP]: undefined;
};
