import { useMercadinNavigation } from "@hooks/use-navigation";
import { useCreateShoppingList } from "@hooks/use-shopping-lists";
import { AuthenticatedNavigation, AuthenticatedStackRouteNames } from "@routes/types";
import { getHttpErrorMessage } from "@services/http";
import { ShoppingList } from "@services/shopping-lists/types";
import { useState } from "react";

type UseCreateShoppingListDialogParams = {
  navigateToDetails?: boolean;
  onCreated?: (list: ShoppingList) => void;
};

export const useCreateShoppingListDialog = ({
  navigateToDetails,
  onCreated,
}: UseCreateShoppingListDialogParams) => {
  const navigation = useMercadinNavigation<AuthenticatedNavigation>();
  const createShoppingList = useCreateShoppingList();
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const reset = () => {
    setName("");
    setCreateError(null);
  };

  const createList = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setCreateError("Informe um nome para a lista.");
      return;
    }
    setCreateError(null);

    try {
      const list = await createShoppingList.mutateAsync({ name: trimmedName });
      reset();
      onCreated?.(list);
      setOpen(false);

      if (navigateToDetails) {
        navigation.navigate(AuthenticatedStackRouteNames.SHOPPING_LIST_DETAILS, {
          listId: list.id,
        });
      }
    } catch (error) {
      setCreateError(await getHttpErrorMessage(error, "Não foi possível criar a lista."));
    }
  };

  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset();
    }

    setOpen(nextOpen);
  };

  return {
    error: createError,
    isCreating: createShoppingList.isPending,
    name,
    onChangeName: setName,
    onConfirm: createList,
    open,
    onOpenChange,
  };
};
