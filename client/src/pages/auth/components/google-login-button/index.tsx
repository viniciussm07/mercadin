import { Button } from "@components/button";
import { Text } from "@components/text";
import { useSession } from "@contexts/session";
import { getHttpErrorMessage } from "@services/http";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const googleLogo = require("./assets/google-logo.png");

export const GoogleLoginButton = () => {
  const {
    session: { signInWithGoogle },
  } = useSession();

  const googleSignInMutation = useMutation({
    mutationFn: signInWithGoogle,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!googleSignInMutation.error) {
      setErrorMessage(null);
      return;
    }

    void getHttpErrorMessage(
      googleSignInMutation.error,
      "Não foi possível entrar com o Google.",
    ).then(setErrorMessage);
  }, [googleSignInMutation.error]);

  return (
    <View className="gap-3">
      <View className="flex-row items-center">
        <View className="h-[1px] flex-1 bg-zinc-100" />
        <Button
          className="mx-2 border-zinc-200 px-6"
          disabled={googleSignInMutation.isPending}
          onPress={() => googleSignInMutation.mutate()}
          variant="outline"
        >
          <Image source={googleLogo} style={{ width: 20, height: 20 }} />
          <Text className="font-fraunces">
            {googleSignInMutation.isPending ? "Conectando..." : "Entrar com o Google"}
          </Text>
        </Button>
        <View className="h-[1px] flex-1 bg-zinc-100" />
      </View>

      {errorMessage ? (
        <Text className="text-center text-sm font-medium text-red-500">{errorMessage}</Text>
      ) : null}
    </View>
  );
};
