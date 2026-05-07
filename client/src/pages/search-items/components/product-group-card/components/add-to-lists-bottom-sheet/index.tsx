import {
  BottomSheet,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetFooter,
  BottomSheetHeader,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@components/bottom-sheet";
import { Button } from "@components/button";
import { CreateShoppingListDialog } from "@components/create-shopping-list-dialog";
import { Icon } from "@components/icon";
import { QuantityCounter } from "@components/quantity-counter";
import { Text } from "@components/text";
import { MarketProduct } from "@services/products/types";
import { View } from "react-native";
import { ListSelector } from "./components/list-selector";
import { ListSearchInput } from "./components/list-search-input";
import { useAddToListsBottomSheet } from "./hooks";

type AddToListsBottomSheetProps = {
  product: MarketProduct;
};

export const AddToListsBottomSheet = ({ product }: AddToListsBottomSheetProps) => {
  const {
    decreaseQuantity,
    filteredLists,
    increaseQuantity,
    isSaving,
    isListDisabled,
    isListSelected,
    lists,
    onOpenChange,
    open,
    quantity,
    save,
    searchQuery,
    selectedListIds,
    setSearchQuery,
    shoppingLists,
    submitError,
    selectCreatedList,
    toggleList,
  } = useAddToListsBottomSheet(product.id);

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange}>
      <BottomSheetTrigger asChild>
        <Button variant="outline" className="h-8 px-3">
          <Icon name="Plus" size={14} className="text-foreground" />
          <Text className="font-questrial text-xs">Adicionar</Text>
        </Button>
      </BottomSheetTrigger>

      <BottomSheetContent>
        <BottomSheetHeader>
          <BottomSheetTitle>Adicionar à lista</BottomSheetTitle>
          <BottomSheetDescription numberOfLines={2}>
            Escolha onde salvar {product.nameInMarket}.
          </BottomSheetDescription>
        </BottomSheetHeader>

        {submitError ? (
          <Text className="font-questrial text-sm text-destructive">{submitError}</Text>
        ) : null}

        <CreateShoppingListDialog
          description="Crie uma lista e selecione-a para salvar este produto."
          onCreated={selectCreatedList}
          title="Criar nova lista"
          triggerClassName="w-full"
          triggerLabel="Criar nova lista"
          triggerSize="default"
          triggerVariant="outline"
        />

        {lists.length > 0 ? (
          <ListSearchInput disabled={isSaving} query={searchQuery} onChangeQuery={setSearchQuery} />
        ) : null}

        {shoppingLists.isPending ? (
          <View className="rounded-lg border border-border bg-white p-4">
            <Text className="font-questrial text-muted-foreground">Carregando listas...</Text>
          </View>
        ) : null}

        {shoppingLists.isError ? (
          <View className="rounded-lg border border-border bg-white p-4">
            <Text className="font-questrial text-muted-foreground">
              Não foi possível carregar suas listas agora.
            </Text>
          </View>
        ) : null}

        {!shoppingLists.isPending && !shoppingLists.isError && lists.length === 0 ? (
          <View className="rounded-lg border border-border bg-white p-4">
            <Text className="font-questrial text-muted-foreground">
              Você ainda não criou nenhuma lista.
            </Text>
          </View>
        ) : null}

        {lists.length > 0 && filteredLists.length === 0 ? (
          <View className="rounded-lg border border-border bg-white p-4">
            <Text className="font-questrial text-muted-foreground">Nenhuma lista encontrada.</Text>
          </View>
        ) : null}

        {filteredLists.length > 0 ? (
          <ListSelector
            isListDisabled={isListDisabled}
            isListSelected={isListSelected}
            isSaving={isSaving}
            lists={filteredLists}
            onToggleList={toggleList}
          />
        ) : null}

        <BottomSheetFooter className="flex-col gap-3 sm:flex-col">
          <QuantityCounter
            disabled={isSaving}
            quantity={quantity}
            onDecrease={decreaseQuantity}
            onIncrease={increaseQuantity}
            description="Unidades do produto"
          />
          <View className="flex-row gap-4">
            <Button
              className="flex-1"
              variant="outline"
              disabled={isSaving}
              onPress={() => onOpenChange(false)}
            >
              <Text>Cancelar</Text>
            </Button>
            <Button
              className="flex-1"
              disabled={selectedListIds.length === 0 || isSaving}
              onPress={() => void save()}
            >
              <Icon name="Save" size={16} className="text-primary-foreground" />
              <Text>{isSaving ? "Salvando..." : "Salvar"}</Text>
            </Button>
          </View>
        </BottomSheetFooter>
      </BottomSheetContent>
    </BottomSheet>
  );
};
