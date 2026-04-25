import { Button } from "@components/button";
import { Text } from "@components/text";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { UnauthenticatedRouteNames } from "@routes/types";
import { cn } from "@utils/cn";

interface OnPress {
  key: string;
  route: NavigationRoute<ParamListBase, string>;
  isFocused: boolean;
}

interface OnLongPress {
  key: string;
}

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const MapRouteToIcon: Record<
  UnauthenticatedRouteNames,
  { focused: IoniconName; unfocused: IoniconName }
> = {
  Login: { focused: "log-in", unfocused: "log-in-outline" } as const,
  Signup: { focused: "person-add", unfocused: "person-add-outline" } as const,
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
    <View className="flex flex-row w-full border-t border-border">
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
            className="w-full flex-1"
            variant="secondary"
            rounded="none"
            size="xl"
          >
            <Ionicons
              name={isFocused ? icon.focused : icon.unfocused}
              size={22}
              className={cn(isFocused ? "text-primary" : "text-foreground")}
            />
            <Text className={cn("font-semibold font-questrial", isFocused && "text-primary")}>
              {label}
            </Text>
          </Button>
        );
      })}
    </View>
  );
};
