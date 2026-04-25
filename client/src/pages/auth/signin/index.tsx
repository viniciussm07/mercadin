import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { UnauthenticatedNavigation, UnauthenticatedRouteNames } from "@routes/types";
import { useLogin } from "./hooks";
import { getFieldErrorMessage } from "@utils/get-field-error-message";
import { Card, CardContent, CardFooter, CardHeader } from "@components/card";
import { Text } from "@components/text";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { Icon } from "@components/icon";
import { GoogleLoginButton } from "@pages/auth/components/google-login-button";

export const SignIn = () => {
  const navigation = useMercadinNavigation<UnauthenticatedNavigation>();
  const { form, signInMutation, submitError } = useLogin();

  return (
    <ScrollView
      className="flex-1 px-4"
      contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="sm:flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => navigation.navigate(UnauthenticatedRouteNames.SIGNUP)}
            className="rounded-full border border-zinc-200 p-2 self-start sm:self-center"
          >
            <Icon name="ArrowLeft" size={20} />
          </TouchableOpacity>

          <View>
            <Text className="text-3xl font-bold text-zinc-900">Entrar</Text>
            <Text className="text-sm text-zinc-400 font-questrial">
              Utilize e-mail e senha ou uma conta do Google.
            </Text>
          </View>
        </CardHeader>

        <CardContent className="gap-y-5">
          <form.Field name="email">
            {field => {
              const errorMessage = getFieldErrorMessage(field.state.meta.errors);

              return (
                <View>
                  <Text className="text-zinc-700 font-semibold">E-mail</Text>
                  <Input
                    value={field.state.value}
                    placeholder="email@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                  />
                  {errorMessage ? (
                    <Text className="mt-2 ml-1 text-sm text-red-500">{errorMessage}</Text>
                  ) : null}
                </View>
              );
            }}
          </form.Field>

          <form.Field name="password">
            {field => {
              const errorMessage = getFieldErrorMessage(field.state.meta.errors);

              return (
                <View>
                  <Text className="text-zinc-700 font-semibold ">Senha</Text>
                  <Input
                    value={field.state.value}
                    placeholder="***********"
                    secureTextEntry
                    onBlur={field.handleBlur}
                    onChangeText={field.handleChange}
                  />
                  {errorMessage ? (
                    <Text className="mt-2 ml-1 text-sm text-red-500">{errorMessage}</Text>
                  ) : null}
                </View>
              );
            }}
          </form.Field>

          <View>
            {submitError ? (
              <Text className="text-center text-sm font-medium text-red-500">{submitError}</Text>
            ) : null}
          </View>

          <GoogleLoginButton />
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-4">
          <Button
            onPress={() => navigation.navigate(UnauthenticatedRouteNames.SIGNUP)}
            variant="outline"
          >
            <Text>Criar conta</Text>
          </Button>

          <Button disabled={signInMutation.isPending} onPress={form.handleSubmit}>
            <Text>{signInMutation.isPending ? "Entrando..." : "Entrar"}</Text>
          </Button>
        </CardFooter>
      </Card>
    </ScrollView>
  );
};
