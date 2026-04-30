import { useMercadinNavigation } from "@hooks/use-navigation";
import { useCreateShoppingList } from "@hooks/use-shopping-lists";
import { AuthenticatedNavigation, AuthenticatedStackRouteNames } from "@routes/types";
import { getHttpErrorMessage } from "@services/http";
import { useState } from "react";

export const useCreateShoppingListDialog = () => {
  const navigation = useMercadinNavigation<AuthenticatedNavigation>();
  const createShoppingList = useCreateShoppingList();
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const createList = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setCreateError("Informe um nome para a lista.");
      return;
    }
    setCreateError(null);

    try {
      const list = await createShoppingList.mutateAsync({ name: trimmedName });
      setName("");
      navigation.navigate(AuthenticatedStackRouteNames.SHOPPING_LIST_DETAILS, { listId: list.id });
      setOpen(false);
    } catch (error) {
      setCreateError(await getHttpErrorMessage(error, "Não foi possível criar a lista."));
    }
  };

  const onOpenChange = () => {
    if (open) {
      setName("");
      setCreateError(null);
      setOpen(false);
      return;
    }
    setOpen(true);
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
