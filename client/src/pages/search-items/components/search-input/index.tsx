import { Icon } from "@components/icon";
import { Input } from "@components/input";
import { useProductSearchStore } from "@stores/product-search";
import { View } from "react-native";

export const SearchInput = () => {
  const query = useProductSearchStore(state => state.query);
  const setQuery = useProductSearchStore(state => state.setQuery);

  return (
    <View className="w-full">
      <Icon name="Search" size={18} className="absolute left-3 top-3 z-10 text-muted-foreground" />
      <Input
        value={query}
        onChangeText={setQuery}
        placeholder="Procure por arroz, leite, café..."
        returnKeyType="search"
        className="h-12 pl-10"
      />
    </View>
  );
};
