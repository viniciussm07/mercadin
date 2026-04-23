import { RouteNames } from "@routes/types";
import { NavBarItem } from "./types";

export const unauthenticatedNavBarItems: NavBarItem[] = [
  { label: "Login", path: RouteNames.LOGIN, icon: "log-in-outline" },
  { label: "Cadastrar", path: RouteNames.SIGNUP, icon: "person-add-outline" },
] as const;
