import { Button } from "@components/button";
import { Icon, IconName } from "@components/icon";
import { Text } from "@components/text";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { UnauthenticatedRouteNames } from "@routes/types";
import { cn } from "@utils/cn";
import { View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

interface OnPress {
  key: string;
  route: NavigationRoute<ParamListBase, string>;
  isFocused: boolean;
}

interface OnLongPress {
  key: string;
}

const MapRouteToIcon: Record<string, { focused: IconName; unfocused: IconName }> = {
  Login: { focused: "User", unfocused: "User" } as const,
  Signup: { focused: "UserPlus", unfocused: "UserPlus" } as const,
  Dashboard: { focused: "LayoutDashboard", unfocused: "LayoutDashboard" } as const,
  MyLists: { focused: "ListChecks", unfocused: "List" } as const,
  Promotions: { focused: "BadgePercent", unfocused: "BadgePercent" } as const,
  SearchItems: { focused: "SearchCheck", unfocused: "Search" } as const,
} as const;

const getRouteIcon = (routeName: string) => {
  if (routeName in MapRouteToIcon) {
    return MapRouteToIcon[routeName];
  }

  return MapRouteToIcon[UnauthenticatedRouteNames.LOGIN];
};

const tabItemLayout = LinearTransition.duration(180);
const labelEntering = FadeIn.duration(120);
const labelExiting = FadeOut.duration(90);

export const BottomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
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
    <View className="absolute bottom-0 left-0 right-0 mb-6 items-center px-4">
      <Animated.View
        layout={tabItemLayout}
        className="flex w-fit max-w-fit flex-row justify-center overflow-hidden rounded-full border border-border bg-white"
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const { options } = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? String(options.tabBarLabel)
              : options.title !== undefined
                ? options.title
                : route.name;

          const icon = getRouteIcon(route.name);

          return (
            <Animated.View
              key={route.key}
              layout={tabItemLayout}
              className={cn("overflow-hidden", index > 0 && "border-l border-border")}
            >
              <Button
                onPress={() => onPress({ key: route.key, route, isFocused })}
                onLongPress={() => onLongPress({ key: route.key })}
                className="px-6 py-2 shadow-none"
                variant="secondary"
                rounded="none"
                size="xl"
              >
                {isFocused ? (
                  <Animated.View
                    entering={labelEntering}
                    exiting={labelExiting}
                    className="w-fit flex-col items-center gap-0.5"
                  >
                    <Icon
                      name={isFocused ? icon.focused : icon.unfocused}
                      size={24}
                      className={cn(isFocused ? "text-primary" : "text-foreground")}
                    />
                    <Text className="font-questrial text-xs text-nowrap break-keep text-primary">
                      {label}
                    </Text>
                  </Animated.View>
                ) : (
                  <Icon
                    name={isFocused ? icon.focused : icon.unfocused}
                    size={24}
                    className={cn(isFocused ? "text-primary" : "text-foreground")}
                  />
                )}
              </Button>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
};
