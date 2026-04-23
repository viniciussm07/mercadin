import { TouchableOpacity, View } from "react-native";
import { useSession } from "@contexts/session";
import { Text } from "@components/text";
import { BaseHeader } from "../base";

export const AuthenticatedHeader = () => {
  const {
    session: { user, signOut },
  } = useSession();

  return (
    <BaseHeader>
      <View className="flex-row items-center gap-4">
        <View className="items-end">
          <Text className="font-semibold text-zinc-900">{user?.name ?? "Usuário"}</Text>
          <Text className="text-sm text-zinc-400">{user?.email}</Text>
        </View>

        <TouchableOpacity
          className="rounded-full border border-zinc-200 px-4 py-2"
          onPress={signOut}
        >
          <Text className="font-semibold text-zinc-700">Sair</Text>
        </TouchableOpacity>
      </View>
    </BaseHeader>
  );
};
