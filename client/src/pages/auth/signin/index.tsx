import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { UnauthenticatedNavigation, UnauthenticatedRouteNames } from "@routes/types";
import { useLogin } from "./hooks";
import { getFieldErrorMessage } from "@utils/get-field-error-message";
import { Card, CardContent, CardFooter, CardHeader } from "@components/card";
import { Text } from "@components/text";
import { Button } from "@components/button";
import { Input } from "@components/input";

export const SignIn = () => {
  const navigation = useMercadinNavigation<UnauthenticatedNavigation>();
  const { form, signInMutation, submitError } = useLogin();

  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <Card>
        <CardHeader className="flex-row items-center mb-8">
          <TouchableOpacity className="mr-4 mt-1 border border-zinc-200 rounded-full p-2">
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-zinc-900">Faça login</Text>
            <Text className="text-zinc-400 text-sm font-questrial">
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
                  <Text className="text-zinc-700 font-semibold mb-1.5 ml-1">E-mail</Text>
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
                  <Text className="text-zinc-700 font-semibold mb-1.5 ml-1">Senha</Text>
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

          <View className="flex-row items-center my-10">
            <View className="flex-1 h-[1px] bg-zinc-100" />
            <TouchableOpacity className="flex-row items-center justify-center border border-zinc-200 rounded-full px-6 py-2.5 mx-2 gap-2">
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/300/300221.png" }}
                className="w-5 h-5"
              />
              <Text className="text-zinc-900 font-medium text-sm">Entrar com o Google</Text>
            </TouchableOpacity>
            <View className="flex-1 h-[1px] bg-zinc-100" />
          </View>
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
    </View>
  );
};
