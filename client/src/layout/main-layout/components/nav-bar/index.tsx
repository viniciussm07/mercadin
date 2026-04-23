import { Ionicons } from "@expo/vector-icons";
import { Text } from "@components/text";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { useNavigationState } from "@react-navigation/native";
import { cn } from "@utils/cn";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useShouldDockNavBar } from "./hooks";
import { Card, CardContent } from "@components/card";
import { NavBarItem } from "@layout/main-layout/types";

interface Props {
  items: NavBarItem[];
}

export const NavBar = ({ items }: Props) => {
  const state = useNavigationState(state => state.routes[state.index]);
  const { navigate } = useMercadinNavigation();
  const insets = useSafeAreaInsets();
  const shouldDockNavBar = useShouldDockNavBar();

  if (items.length === 0) return null;
  if (shouldDockNavBar) {
    return (
      <View
        className="absolute inset-x-4 bottom-0 left-1/2 -translate-x-1/2 w-1/2 z-50"
        pointerEvents="box-none"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Card>
          <CardContent>
            <View className="flex flex-row">
              {items.map(item => {
                const isActive = state.name === item.path;

                return (
                  <Pressable
                    key={item.path}
                    className="flex-1 items-center justify-center gap-1 rounded-2xl px-2 py-2"
                    onPress={() => navigate(item.path)}
                  >
                    <Ionicons name={item.icon} size={24} color={isActive ? "#FF5C12" : "#71717A"} />
                    <Text
                      className={cn(
                        "text-2xs",
                        isActive ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </CardContent>
        </Card>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-6">
      {items.map(item => {
        const isActive = state.name === item.path;

        return (
          <Pressable
            key={item.path}
            className="flex-row items-center gap-2"
            onPress={() => navigate(item.path)}
          >
            <Ionicons name={item.icon} size={18} color={isActive ? "#FF5C12" : "#18181B"} />
            <Text
              className={cn("font-medium", isActive ? "text-primary underline" : "text-foreground")}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
