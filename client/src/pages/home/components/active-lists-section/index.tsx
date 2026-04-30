import { View } from "react-native";
import { Card, CardContent } from "@components/card";
import { Text } from "@components/text";
import { useActiveShoppingLists } from "../../hooks";
import { ShoppingListCard } from "./components/shopping-list-card";

export const ActiveListsSection = () => {
  const { shoppingLists } = useActiveShoppingLists();
  const lists = shoppingLists.data ?? [];

  return (
    <View className="gap-4">
      <View>
        <Text className="text-2xl font-bold text-foreground">Suas listas ativas</Text>
      </View>

      {shoppingLists.isPending ? (
        <Card className="border-0 bg-white py-5">
          <CardContent>
            <Text className="font-questrial text-muted-foreground">Carregando suas listas...</Text>
          </CardContent>
        </Card>
      ) : null}

      {shoppingLists.isError ? (
        <Card className="border-0 bg-white py-5">
          <CardContent>
            <Text className="font-questrial text-muted-foreground">
              Não foi possível carregar suas listas agora.
            </Text>
          </CardContent>
        </Card>
      ) : null}

      {!shoppingLists.isPending && !shoppingLists.isError && lists.length === 0 ? (
        <Card className="border-0 bg-white py-5">
          <CardContent>
            <Text className="font-questrial text-muted-foreground">
              Você ainda não tem listas ativas.
            </Text>
          </CardContent>
        </Card>
      ) : null}

      {lists.length > 0 ? (
        <View className="gap-3 lg:flex-row">
          {lists.slice(0, 3).map(list => (
            <ShoppingListCard key={list.id} list={list} />
          ))}
        </View>
      ) : null}
    </View>
  );
};
