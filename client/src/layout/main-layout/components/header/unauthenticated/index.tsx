import React from "react";
import { View } from "react-native";
import { BaseHeader } from "../base";
import { NavBar } from "../../nav-bar";
import { NavBarItem } from "@layout/main-layout/types";

interface Props {
  items: NavBarItem[];
}

export const UnauthenticatedHeader = ({ items }: Props) => {
  return (
    <BaseHeader>
      <View className="flex-row items-center gap-6">
        {items.length > 0 && <NavBar items={items} />}
      </View>
    </BaseHeader>
  );
};
