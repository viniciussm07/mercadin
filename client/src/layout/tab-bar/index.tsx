import { BottomTabBar } from "./components/bottom-tab-bar";
import { TopTabBar } from "./components/top-tab-bar";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { env } from "@utils/environment";

export const TabBar = (props: BottomTabBarProps) => {
  return env.isWeb ? <TopTabBar {...props} /> : <BottomTabBar {...props} />;
};
