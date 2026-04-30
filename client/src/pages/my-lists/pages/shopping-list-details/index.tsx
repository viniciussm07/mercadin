import { Button } from "@components/button";
import { Card, CardContent, CardHeader } from "@components/card";
import { DeleteShoppingListDialog } from "@pages/my-lists/components/delete-shopping-list-dialog";
import { Icon } from "@components/icon";
import { Input } from "@components/input";
import { Text } from "@components/text";
import { ScrollView, View } from "react-native";
import { DeleteListCard } from "./components/delete-list-card";
import { ShoppingListItemCard } from "./components/shopping-list-item-card";
import { useShoppingListDetails } from "./hooks";

const contentContainerStyle = { paddingBottom: 120, paddingTop: 56 };

export const ShoppingListDetails = () => {
  const {
    deleteError,
    deleteListDialog,
    name,
    navigation,
    requestDeleteList,
    removeShoppingList,
    saveName,
    setName,
    shoppingList,
    submitError,
    updateShoppingList,
  } = useShoppingListDetails();
  const list = shoppingList.data;
  const items = list?.items ?? [];

  return (
    <ScrollView
      className="flex-1 bg-background px-4 lg:px-8"
      contentContainerStyle={contentContainerStyle}
    >
      <View className="w-full max-w-4xl self-center gap-6">
        <View className="flex-row items-start gap-3">
          <Button variant="outline" size="icon" onPress={() => navigation.goBack()}>
            <Icon name="ArrowLeft" size={18} className="text-foreground" />
          </Button>

          <View className="min-w-0 flex-1 gap-2">
            <Text className="text-3xl font-bold text-foreground">Detalhes da lista</Text>
            <Text className="font-questrial text-base text-muted-foreground">
              Visualize os itens e renomeie sua lista.
            </Text>
          </View>
        </View>

        {shoppingList.isPending ? (
          <Card className="border-0 bg-white py-5">
            <CardContent>
              <Text className="font-questrial text-muted-foreground">Carregando lista...</Text>
            </CardContent>
          </Card>
        ) : null}

        {shoppingList.isError ? (
          <Card className="border-0 bg-white py-5">
            <CardContent>
              <Text className="font-questrial text-muted-foreground">
                Não foi possível carregar esta lista.
              </Text>
            </CardContent>
          </Card>
        ) : null}

        {list ? (
          <>
            <Card className="border-0 bg-white py-5 shadow-sm">
              <CardHeader className="gap-1">
                <Text className="text-xl font-bold text-foreground">Nome da lista</Text>
                <Text className="font-questrial text-sm text-muted-foreground">
                  Alterar o nome atualiza a ordem das listas recentes.
                </Text>
              </CardHeader>
              <CardContent className="gap-3">
                <View className="gap-3 sm:flex-row">
                  <Input
                    value={name}
                    placeholder="Nome da lista"
                    returnKeyType="done"
                    onChangeText={setName}
                    onSubmitEditing={() => void saveName()}
                    className="flex-1"
                  />
                  <Button disabled={updateShoppingList.isPending} onPress={() => void saveName()}>
                    <Icon name="Save" size={16} className="text-primary-foreground" />
                    <Text>{updateShoppingList.isPending ? "Salvando..." : "Salvar"}</Text>
                  </Button>
                </View>

                {submitError ? (
                  <Text className="font-questrial text-sm text-destructive">{submitError}</Text>
                ) : null}
              </CardContent>
            </Card>

            {deleteError ? (
              <Card className="border-0 bg-white py-5">
                <CardContent>
                  <Text className="font-questrial text-destructive">{deleteError}</Text>
                </CardContent>
              </Card>
            ) : null}

            <View className="gap-3">
              <View className="flex-row items-center justify-between gap-3">
                <Text className="text-2xl font-bold text-foreground">Itens</Text>
                <View className="rounded-full bg-primary/10 px-2 py-1">
                  <Text className="font-questrial text-[10px] uppercase text-primary">
                    {items.length} {items.length === 1 ? "item" : "itens"}
                  </Text>
                </View>
              </View>

              {items.length === 0 ? (
                <Card className="border-0 bg-white py-5">
                  <CardContent>
                    <Text className="font-questrial text-muted-foreground">
                      Esta lista ainda não tem itens.
                    </Text>
                  </CardContent>
                </Card>
              ) : (
                <View className="gap-3">
                  {items.map(item => (
                    <ShoppingListItemCard key={item.id} item={item} listId={list.id} />
                  ))}
                </View>
              )}
            </View>

            <DeleteListCard
              isDeleting={removeShoppingList.isPending}
              onDelete={requestDeleteList}
            />
            <DeleteShoppingListDialog {...deleteListDialog} />
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};
