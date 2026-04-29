import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { useSession } from "@contexts/session";
import { UserMenu } from "@layout/user-menu";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HeaderMobile = (_: BottomTabHeaderProps) => {
  const insets = useSafeAreaInsets();
  const {
    session: { isAuthenticated },
  } = useSession();
  return (
    <View
      className="flex-row items-center justify-between border-b border-zinc-100 bg-white px-6"
      style={{ paddingTop: insets.top - 20, minHeight: 50 + insets.top }}
    >
      <View className="flex-row items-center gap-3">
        <Icon name="ShoppingBasket" size={32} className="text-primary" />
        <Text className="text-2xl font-extrabold text-foreground">Mercadin</Text>
      </View>

      {isAuthenticated && <UserMenu />}
    </View>
  );
};
