import { PropsWithChildren } from "react";
import { View } from "react-native";
import { Text } from "@components/text";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const BaseHeader = ({ children }: PropsWithChildren) => {
  return (
    <View className="h-20 bg-white border-b border-zinc-100 flex-row items-center justify-between px-4 sm:px-8">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="basket" size={24} color="#FF5C12" />
        <Text className="text-xl font-extrabold text-zinc-900 tracking-tighter">Mercadin</Text>
      </View>

      {children}
    </View>
  );
};
