import { Button } from "@components/button";
import { Card, CardContent } from "@components/card";
import { DeleteShoppingListDialog } from "@pages/my-lists/components/delete-shopping-list-dialog";
import { Icon } from "@components/icon";
import { Input } from "@components/input";
import { Text } from "@components/text";
import { ScrollView, View } from "react-native";
import { MyListCard } from "./components/my-list-card";
import { useMyLists } from "./hooks";

const contentContainerStyle = { paddingBottom: 120, paddingTop: 56 };

export const MyLists = () => {
  const {
    confirmDeleteList,
    createList,
    createShoppingList,
    deleteError,
    isDeleteDialogOpen,
    listToDelete,
    name,
    openList,
    requestDeleteList,
    removeShoppingList,
    setIsDeleteDialogOpen,
    setName,
    shoppingLists,
    submitError,
  } = useMyLists();
  const lists = shoppingLists.data ?? [];

  return (
    <ScrollView
      className="flex-1 bg-background px-4 lg:px-8"
      contentContainerStyle={contentContainerStyle}
    >
      <View className="w-full max-w-4xl self-center gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold text-foreground">Minhas listas</Text>
          <Text className="font-questrial text-base text-muted-foreground">
            Crie e organize suas listas de compras.
          </Text>
        </View>

        <Card className="border-0 bg-white py-5 shadow-sm">
          <CardContent className="gap-3">
            <Text className="font-semibold text-foreground">Nova lista</Text>
            <View className="gap-3 sm:flex-row">
              <Input
                value={name}
                placeholder="Ex: Compra do mês"
                returnKeyType="done"
                onChangeText={setName}
                onSubmitEditing={() => void createList()}
                className="flex-1"
              />
              <Button disabled={createShoppingList.isPending} onPress={() => void createList()}>
                <Icon name="Plus" size={16} className="text-primary-foreground" />
                <Text>{createShoppingList.isPending ? "Criando..." : "Criar lista"}</Text>
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

        {shoppingLists.isPending ? (
          <Card className="border-0 bg-white py-5">
            <CardContent>
              <Text className="font-questrial text-muted-foreground">Carregando listas...</Text>
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
                Você ainda não criou nenhuma lista.
              </Text>
            </CardContent>
          </Card>
        ) : null}

        {lists.length > 0 ? (
          <View className="gap-3">
            {lists.map(list => (
              <MyListCard
                key={list.id}
                isDeleting={
                  removeShoppingList.isPending && removeShoppingList.variables === list.id
                }
                list={list}
                onDelete={requestDeleteList}
                onOpen={openList}
              />
            ))}
          </View>
        ) : null}

        <DeleteShoppingListDialog
          isDeleting={removeShoppingList.isPending}
          listName={listToDelete?.name}
          open={isDeleteDialogOpen}
          onConfirm={confirmDeleteList}
          onOpenChange={setIsDeleteDialogOpen}
        />
      </View>
    </ScrollView>
  );
};
