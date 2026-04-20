import { Text, View } from "react-native";

export const Home = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-zinc-900">
      <Text className="text-xl font-bold text-zinc-900 dark:text-white">Mercadin</Text>
      <Text className="text-base text-zinc-500 dark:text-zinc-400 mt-2">Bem-vindo ao app!</Text>
    </View>
  );
};
