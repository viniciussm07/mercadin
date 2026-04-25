import { Button } from "@components/button";
import { Text } from "@components/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { NavigationRoute, ParamListBase } from "@react-navigation/native";
import { View } from "react-native";
import { cn } from "@utils/cn";

interface OnPress {
  key: string;
  route: NavigationRoute<ParamListBase, string>;
  isFocused: boolean;
}

interface OnLongPress {
  key: string;
}

export const HeaderTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
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
    <View className="h-20 flex-row items-center justify-between border-b border-zinc-100 bg-white px-8">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="basket" size={32} color="#FF5C12" />
        <Text className="text-2xl font-extrabold text-zinc-900">Mercadin</Text>
      </View>

      <View className="flex-row items-center gap-3">
        {state.routes.map((route, index) => {
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
                  "font-semibold font-questrial",
                  isFocused && "text-primary-foreground",
                )}
              >
                {label}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
};
