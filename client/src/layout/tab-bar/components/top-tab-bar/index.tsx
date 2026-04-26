import { Button } from "@components/button";
import { Text } from "@components/text";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { View } from "react-native";
import { cn } from "@utils/cn";
import { Icon } from "@components/icon";
import { AuthenticatedRouteNames } from "@routes/types";
import { env } from "@utils/environment";
import { Input } from "@components/input";
import { UserMenu } from "@layout/user-menu";
import { useSession } from "@contexts/session";

interface OnPress {
  key: string;
  route: NavigationRoute<ParamListBase, string>;
  isFocused: boolean;
}

interface OnLongPress {
  key: string;
}

const REMOVE_TAB_FROM_WEB: AuthenticatedRouteNames[] = [AuthenticatedRouteNames.SEARCH_ITEMS];

const filterTabs = (route: NavigationRoute<ParamListBase, string>) => {
  if (REMOVE_TAB_FROM_WEB.includes(route.name as AuthenticatedRouteNames) && env.isWeb) {
    return false;
  }

  return true;
};

export const TopTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const {
    session: { isAuthenticated },
  } = useSession();
  const onPress = ({ key, route, isFocused }: OnPress) => {
    const event = navigation.emit({
      type: "tabPress",
      target: key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  const onLongPress = ({ key }: OnLongPress) => {
    navigation.emit({
      type: "tabLongPress",
      target: key,
    });
  };

  return (
    <View className="h-20 flex-row items-center gap-6 border-b border-zinc-100 bg-white px-8">
      <View className="flex-row justify-between gap-4 flex-1">
        <View className="flex-row items-center gap-2">
          <Icon name="ShoppingBasket" size={32} className="text-primary" />
          <Text className="text-2xl font-extrabold text-foreground">Mercadin</Text>
        </View>
      </View>

      {isAuthenticated && (
        <View className="grid w-full max-w-[400px] flex-1">
          <Icon
            name="Search"
            className="col-[1/1] row-[1/1] z-10 ml-2 self-center text-muted-foreground"
            size={18}
          />
          <Input placeholder="Procurar..." className="col-[1/1] row-[1/1] pl-8" />
        </View>
      )}

      <View className="flex-row justify-end flex-1">
        <View className="flex-row items-center gap-3">
          {state.routes.filter(filterTabs).map((route, index) => {
            const isFocused = state.index === index;
            const { options } = descriptors[route.key];

            const label =
              options.tabBarLabel !== undefined
                ? String(options.tabBarLabel)
                : options.title !== undefined
                  ? options.title
                  : route.name;

            return (
              <Button
                key={route.key}
                onPress={() => onPress({ key: route.key, route, isFocused })}
                onLongPress={() => onLongPress({ key: route.key })}
                variant={isFocused ? "default" : "ghost"}
              >
                <Text
                  className={cn(
                    "font-questrial font-semibold",
                    isFocused && "text-primary-foreground",
                  )}
                >
                  {label}
                </Text>
              </Button>
            );
          })}
        </View>

        {isAuthenticated && (
          <View className="shrink-0 border-l border-border pl-4">
            <UserMenu />
          </View>
        )}
      </View>
    </View>
  );
};
