import { useState } from "react";
import { AuthenticatedNavigation, AuthenticatedStackRouteNames } from "@routes/types";
import { getHttpErrorMessage } from "@services/http";
import {
  useCreateShoppingList,
  useRemoveShoppingList,
  useShoppingLists,
} from "@hooks/use-shopping-lists";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { ShoppingList } from "@services/shopping-lists/types";

export const useMyLists = () => {
  const navigation = useMercadinNavigation<AuthenticatedNavigation>();
  const shoppingLists = useShoppingLists();
  const createShoppingList = useCreateShoppingList();
  const removeShoppingList = useRemoveShoppingList();
  const [name, setName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const createList = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setSubmitError("Informe um nome para a lista.");
      return;
    }

    setSubmitError(null);

    try {
      await createShoppingList.mutateAsync({ name: trimmedName });
      setName("");
    } catch (error) {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível criar a lista."));
    }
  };

  const openList = (listId: string) => {
    navigation.navigate(AuthenticatedStackRouteNames.SHOPPING_LIST_DETAILS, { listId });
  };

  const requestDeleteList = (list: ShoppingList) => {
    setListToDelete(list);
    setIsDeleteDialogOpen(true);
  };

  const deleteList = async () => {
    if (!listToDelete) {
      return;
    }

    setIsDeleteDialogOpen(false);
    setDeleteError(null);

    try {
      await removeShoppingList.mutateAsync(listToDelete.id);
      setListToDelete(null);
    } catch (error) {
      setDeleteError(await getHttpErrorMessage(error, "Não foi possível excluir a lista."));
    }
  };

  const confirmDeleteList = () => {
    void deleteList();
  };

  return {
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
  };
};
