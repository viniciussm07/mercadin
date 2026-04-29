import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/dropdown-menu";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { useSession } from "@contexts/session";
import { Image, View } from "react-native";

export const UserMenu = () => {
  const {
    session: { signOut, user },
  } = useSession();

  const displayName = user?.name?.trim() || "Usuário";
  const avatarUrl = user?.avatarUrl?.trim();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-10 items-center justify-center overflow-hidden rounded-full border border-border bg-accent">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="size-10 rounded-full"
            accessibilityLabel={`Avatar de ${displayName}`}
          />
        ) : (
          <Icon name="User" size={20} className="text-muted-foreground" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="bottom" sideOffset={8} className="min-w-48">
        <DropdownMenuLabel className="px-3 py-2">
          <Text numberOfLines={1} className="font-questrial text-sm font-semibold text-foreground">
            {displayName}
          </Text>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onPress={() => void signOut()}>
          <View className="flex-row items-center gap-2">
            <Icon name="LogOut" size={16} className="text-destructive" />
            <Text className="font-questrial text-sm text-destructive">Sair</Text>
          </View>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
