import { Button } from "@components/button";
import { Text } from "@components/text";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { UnauthenticatedRouteNames } from "@routes/types";
import { cn } from "@utils/cn";
import { Icon, IconName } from "@components/icon";

interface OnPress {
  key: string;
  route: NavigationRoute<ParamListBase, string>;
  isFocused: boolean;
}

interface OnLongPress {
  key: string;
}

const MapRouteToIcon: Record<
  UnauthenticatedRouteNames,
  { focused: IconName; unfocused: IconName }
> = {
  Login: { focused: "User", unfocused: "User" } as const,
  Signup: { focused: "UserPlus", unfocused: "UserPlus" } as const,
} as const;

const getRouteIcon = (routeName: string) => {
  if (routeName === UnauthenticatedRouteNames.SIGNUP) {
    return MapRouteToIcon[UnauthenticatedRouteNames.SIGNUP];
  }

  return MapRouteToIcon[UnauthenticatedRouteNames.LOGIN];
};

export const BottomTab = ({ state, descriptors, navigation }: BottomTabBarProps) => {
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
    <View className="flex flex-row max-w-[300px] overflow-hidden bg-white w-full self-center justify-center rounded-full border border-border mb-6">
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
          <Button
            key={route.key}
            onPress={() => onPress({ key: route.key, route, isFocused })}
            onLongPress={() => onLongPress({ key: route.key })}
            className={cn(
              "flex-1 shadow-none items-center px-6 h-fit py-2 flex-col gap-0.5",
              index % 2 !== 0 && "border-l border-border",
            )}
            variant="secondary"
            rounded="none"
            size="xl"
          >
            <Icon
              name={isFocused ? icon.focused : icon.unfocused}
              size={24}
              className={cn(isFocused ? "text-primary" : "text-foreground")}
            />
            <Text className={cn("text-sm font-questrial", isFocused && "text-primary")}>
              {label}
            </Text>
          </Button>
        );
      })}
    </View>
  );
};
