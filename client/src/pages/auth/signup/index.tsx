import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { UnauthenticatedNavigation, UnauthenticatedRouteNames } from "@routes/types";
import { Card, CardContent, CardFooter, CardHeader } from "@components/card";
import { Text } from "@components/text";
import { Button } from "@components/button";
import { Input } from "@components/input";

export const SignUp = () => {
  const navigation = useMercadinNavigation<UnauthenticatedNavigation>();

  return (
    <View className="flex-1 items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md py-10">
        <CardHeader className="mb-8 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 mt-1 rounded-full border border-zinc-200 p-2"
          >
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>

          <View className="flex-1">
            <Text className="text-3xl font-bold text-zinc-900">Crie sua conta</Text>
            <Text className="text-sm text-zinc-400 font-questrial">
              Utilize e-mail e senha ou uma conta do Google.
            </Text>
          </View>
        </CardHeader>

        <CardContent className="gap-y-5">
          <View>
            <Text className="mb-1.5 ml-1 font-semibold text-zinc-700">Nome completo</Text>
            <Input placeholder="Seu nome completo" />
          </View>

          <View>
            <Text className="mb-1.5 ml-1 font-semibold text-zinc-700">E-mail</Text>
            <Input
              placeholder="email@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="mb-1.5 ml-1 font-semibold text-zinc-700">Senha</Text>
            <Input placeholder="***********" secureTextEntry />
          </View>

          <View className="my-10 flex-row items-center">
            <View className="h-[1px] flex-1 bg-zinc-100" />
            <TouchableOpacity className="mx-2 flex-row items-center justify-center gap-2 rounded-full border border-zinc-200 px-6 py-2.5">
              <Image
                source={{ uri: "https://cdn-icons-png.flaticon.com/128/300/300221.png" }}
                className="h-5 w-5"
              />
              <Text className="text-sm font-medium text-zinc-900">Entrar com o Google</Text>
            </TouchableOpacity>
            <View className="h-[1px] flex-1 bg-zinc-100" />
          </View>
        </CardContent>

        <CardFooter className="flex-row items-center justify-between gap-4">
          <Button
            onPress={() => navigation.navigate(UnauthenticatedRouteNames.LOGIN)}
            variant="outline"
          >
            <Text>Já tenho conta</Text>
          </Button>

          <Button>
            <Text>Criar conta</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
};
