import { RouteNames } from "@routes/types";
import { Ionicons } from "@expo/vector-icons";

export interface NavBarItem {
  label: string;
  path: RouteNames;
  icon: React.ComponentProps<typeof Ionicons>["name"];
}
