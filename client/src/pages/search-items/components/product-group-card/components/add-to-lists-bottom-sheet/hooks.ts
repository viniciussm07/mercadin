import { useAddItemToShoppingLists, useShoppingLists } from "@hooks/use-shopping-lists";
import { getHttpErrorMessage } from "@services/http";
import { ShoppingList } from "@services/shopping-lists/types";
import { useMemo, useState } from "react";

export const useAddToListsBottomSheet = (marketProductId: string) => {
  const shoppingLists = useShoppingLists();
  const addItemToShoppingLists = useAddItemToShoppingLists();
  const [open, setOpen] = useState(false);
  const [selectedListIds, setSelectedListIds] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const lists = useMemo(() => shoppingLists.data ?? [], [shoppingLists.data]);
  const filteredLists = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("pt-BR");

    if (!query) {
      return lists;
    }

    return lists.filter(list => list.name.toLocaleLowerCase("pt-BR").includes(query));
  }, [lists, searchQuery]);

  const listIdsWithProduct = useMemo(
    () =>
      new Set(
        lists
          .filter(list => list.items.some(item => item.marketProductId === marketProductId))
          .map(list => list.id),
      ),
    [lists, marketProductId],
  );

  const reset = () => {
    setSelectedListIds([]);
    setSubmitError(null);
    setQuantity(1);
    setSearchQuery("");
  };

  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }

    setOpen(nextOpen);
  };

  const isListSelected = (listId: string) => selectedListIds.includes(listId);
  const isListDisabled = (list: ShoppingList) => listIdsWithProduct.has(list.id);

  const toggleList = (list: ShoppingList) => {
    if (isListDisabled(list)) {
      return;
    }

    setSubmitError(null);
    setSelectedListIds(current =>
      current.includes(list.id) ? current.filter(id => id !== list.id) : [...current, list.id],
    );
  };

  const decreaseQuantity = () => {
    setQuantity(current => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity(current => current + 1);
  };

  const save = async () => {
    if (selectedListIds.length === 0) {
      return;
    }

    setSubmitError(null);

    try {
      await addItemToShoppingLists.mutateAsync({
        listIds: selectedListIds,
        marketProductId,
        quantity,
      });
      reset();
      setOpen(false);
    } catch (error) {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível adicionar o produto."));
    }
  };

  return {
    decreaseQuantity,
    filteredLists,
    increaseQuantity,
    isSaving: addItemToShoppingLists.isPending,
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
    toggleList,
  };
};
