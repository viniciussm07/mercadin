import { Button } from "@components/button";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { ToggleGroup, ToggleGroupItem } from "@components/toggle-group";
import { useSession } from "@contexts/session";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { AuthenticatedNavigation } from "@routes/types";
import { ScrollView, View } from "react-native";
import { SettingsActionsCard } from "./components/settings-actions-card";
import { UserProfileCard } from "./components/user-profile-card";
import { useUserSettings } from "./hooks";

const contentContainerStyle = { paddingBottom: 120, paddingTop: 56 };

export const UserSettings = () => {
  const navigation = useMercadinNavigation<AuthenticatedNavigation>();
  const {
    session: { user },
  } = useSession();
  const { isWide, onChangePanel, selectedPanel } = useUserSettings();

  const displayName = user?.name?.trim() || "Usuário";
  const email = user?.email ?? "";

  return (
    <ScrollView
      className="flex-1 bg-background px-4 lg:px-8"
      contentContainerStyle={contentContainerStyle}
    >
      <View className="w-full max-w-5xl self-center gap-6">
        <View className="flex-row items-start gap-3">
          <Button variant="outline" size="icon" onPress={() => navigation.goBack()}>
            <Icon name="ArrowLeft" size={18} className="text-foreground" />
          </Button>

          <View className="min-w-0 flex-1 gap-2">
            <Text className="text-3xl font-bold text-foreground lg:text-4xl">
              Configurações & Usuário
            </Text>
            <Text className="font-questrial text-base text-muted-foreground">
              Gerencie seus dados de acesso e preferências de conta.
            </Text>
          </View>
        </View>

        {!isWide ? (
          <ToggleGroup
            type="single"
            value={selectedPanel}
            onValueChange={onChangePanel}
            variant="outline"
            className="w-full items-stretch"
          >
            <ToggleGroupItem value="settings" isFirst className="flex-1">
              <Text className="font-questrial text-sm">Configurações</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="profile" isLast className="flex-1">
              <Text className="font-questrial text-sm">Usuário</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        ) : null}

        {isWide ? (
          <View className="gap-8 lg:flex-row">
            <SettingsActionsCard currentEmail={email} />
            <UserProfileCard avatarUrl={user?.avatarUrl} email={email} name={displayName} />
          </View>
        ) : selectedPanel === "settings" ? (
          <SettingsActionsCard currentEmail={email} />
        ) : (
          <UserProfileCard avatarUrl={user?.avatarUrl} email={email} name={displayName} />
        )}
      </View>
    </ScrollView>
  );
};
