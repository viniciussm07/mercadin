import React from "react";
import { Text, View, TextInput, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Navbar } from "@components/nav-bar";
import { useNavigation } from "@react-navigation/native";

export const Login = () => {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 bg-[#F8F5F0]">
      <Navbar activePage="login" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 items-center justify-center px-6 py-10">
          <View className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-sm border border-zinc-100">
            <View className="flex-row items-start mb-8">
              <TouchableOpacity className="mr-4 mt-1 border border-zinc-200 rounded-full p-2">
                <Ionicons name="arrow-back" size={20} color="black" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-3xl font-bold text-zinc-900">Faça login</Text>
                <Text className="text-zinc-400 text-sm">
                  Utilize e-mail e senha ou uma conta do Google.
                </Text>
              </View>
            </View>

            <View className="gap-y-5">
              <View>
                <Text className="text-zinc-700 font-semibold mb-1.5 ml-1">E-mail</Text>
                <TextInput
                  placeholder="email@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full border border-zinc-200 rounded-2xl px-4 text-base h-12 text-zinc-600"
                />
              </View>

              <View>
                <Text className="text-zinc-700 font-semibold mb-1.5 ml-1">Senha</Text>
                <TextInput
                  placeholder="***********"
                  secureTextEntry
                  className="w-full border border-zinc-200 rounded-2xl px-4 text-base h-12 text-zinc-600"
                />
              </View>
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

            <View className="flex-row items-center justify-between gap-4">
              <TouchableOpacity
                className="flex-1 border border-zinc-100 rounded-full py-4 items-center"
                onPress={() => navigation.navigate("Home")}
              >
                <Text className="text-orange-600 font-bold">Criar conta</Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 bg-orange-600 rounded-full py-4 items-center shadow-lg shadow-orange-200">
                <Text className="text-white font-bold">Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
