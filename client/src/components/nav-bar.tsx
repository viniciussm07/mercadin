import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

interface NavbarProps {
  activePage: "login" | "signup";
}

export const Navbar = ({ activePage }: NavbarProps) => {
  const navigation = useNavigation<any>();

  return (
    <View className="h-20 bg-white border-b border-zinc-100 flex-row items-center justify-between px-10">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name="basket" size={24} color="#FF5C12" />
        <Text className="text-xl font-extrabold text-zinc-900 tracking-tighter">Mercadin</Text>
      </View>

      <View className="flex-row items-center gap-6">
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            className={`${
              activePage === "login" ? "text-orange-600 font-bold" : "text-zinc-400 font-medium"
            }`}
          >
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text
            className={`${
              activePage === "signup" ? "text-orange-600 font-bold" : "text-zinc-400 font-medium"
            }`}
          >
            Cadastrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
