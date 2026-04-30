import { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  AuthenticatedNavigation,
  AuthenticatedStackParamList,
  AuthenticatedStackRouteNames,
} from "@routes/types";
import { getHttpErrorMessage } from "@services/http";
import {
  useRemoveShoppingList,
  useShoppingList,
  useUpdateShoppingList,
} from "@hooks/use-shopping-lists";
import { useMercadinNavigation } from "@hooks/use-navigation";

type ShoppingListDetailsRoute = RouteProp<
  AuthenticatedStackParamList,
  AuthenticatedStackRouteNames.SHOPPING_LIST_DETAILS
>;

export const useShoppingListDetails = () => {
  const navigation = useMercadinNavigation<AuthenticatedNavigation>();
  const route = useRoute<ShoppingListDetailsRoute>();
  const listId = route.params.listId;
  const shoppingList = useShoppingList(listId);
  const updateShoppingList = useUpdateShoppingList(listId);
  const removeShoppingList = useRemoveShoppingList();
  const [name, setName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (shoppingList.data?.name) {
      setName(shoppingList.data.name);
    }
  }, [shoppingList.data?.name]);

  const saveName = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setSubmitError("Informe um nome para a lista.");
      return;
    }

    if (trimmedName === shoppingList.data?.name) {
      setSubmitError(null);
      return;
    }

    setSubmitError(null);

    try {
      await updateShoppingList.mutateAsync({ name: trimmedName });
    } catch (error) {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível renomear a lista."));
    }
  };

  const deleteList = async () => {
    setIsDeleteDialogOpen(false);
    setDeleteError(null);

    try {
      await removeShoppingList.mutateAsync(listId);
      navigation.goBack();
    } catch (error) {
      setDeleteError(await getHttpErrorMessage(error, "Não foi possível excluir a lista."));
    }
  };

  const requestDeleteList = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteList = () => {
    void deleteList();
  };

  return {
    deleteListDialog: {
      isDeleting: removeShoppingList.isPending,
      listName: shoppingList.data?.name,
      onConfirm: confirmDeleteList,
      onOpenChange: setIsDeleteDialogOpen,
      open: isDeleteDialogOpen,
    },
    deleteError,
    name,
    navigation,
    requestDeleteList,
    removeShoppingList,
    saveName,
    setName,
    shoppingList,
    submitError,
    updateShoppingList,
  };
};
