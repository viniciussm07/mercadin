import { useState } from "react";
import { useMercadinNavigation } from "@hooks/use-navigation";
import { useRemoveShoppingList } from "@hooks/use-shopping-lists";
import { AuthenticatedNavigation, AuthenticatedStackRouteNames } from "@routes/types";
import { getHttpErrorMessage } from "@services/http";
import { ShoppingList } from "@services/shopping-lists/types";

export const useShoppingListActions = () => {
  const navigation = useMercadinNavigation<AuthenticatedNavigation>();
  const removeShoppingList = useRemoveShoppingList();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
    deleteError,
    isDeleteDialogOpen,
    listToDelete,
    openList,
    removeShoppingList,
    requestDeleteList,
    setIsDeleteDialogOpen,
  };
};
