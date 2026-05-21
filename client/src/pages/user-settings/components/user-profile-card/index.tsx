import { Button } from "@components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@components/card";
import { Icon } from "@components/icon";
import { Text } from "@components/text";
import { useSession } from "@contexts/session";
import { Image, View } from "react-native";

type UserProfileCardProps = {
  email: string;
  name: string;
  avatarUrl?: string | null;
};

export const UserProfileCard = ({ avatarUrl, email, name }: UserProfileCardProps) => {
  const {
    session: { signOut },
  } = useSession();

  return (
    <Card className="min-h-[360px] flex-1 justify-between overflow-hidden rounded-[32px] border-border/60 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-border py-6">
        <Text className="text-3xl font-bold text-foreground">Usuário</Text>
      </CardHeader>

      <CardContent className="items-center gap-6 py-8">
        <View className="size-32 items-center justify-center overflow-hidden rounded-full border border-border bg-accent">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="size-32 rounded-full"
              accessibilityLabel={`Avatar de ${name}`}
            />
          ) : (
            <Icon name="User" size={56} className="text-muted-foreground" />
          )}
        </View>

        <View className="max-w-full items-center gap-1">
          <Text numberOfLines={2} className="text-center text-3xl font-bold text-foreground">
            {name}
          </Text>
          <Text numberOfLines={1} className="font-questrial text-sm text-muted-foreground">
            {email}
          </Text>
        </View>
      </CardContent>

      <CardFooter className="justify-center border-t border-border py-6">
        <Button className="min-w-40" onPress={() => void signOut()}>
          <Icon name="LogOut" size={16} className="text-primary-foreground" />
          <Text>Sair</Text>
        </Button>
      </CardFooter>
    </Card>
  );
};
