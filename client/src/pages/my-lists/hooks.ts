import { useState } from "react";
import { getHttpErrorMessage } from "@services/http";
import { useCreateShoppingList, useShoppingLists } from "@hooks/use-shopping-lists";
import { useShoppingListActions } from "@hooks/use-shopping-list-actions";

export const useMyLists = () => {
  const shoppingLists = useShoppingLists();
  const createShoppingList = useCreateShoppingList();
  const listActions = useShoppingListActions();
  const [name, setName] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  return {
    ...listActions,
    createList,
    createShoppingList,
    name,
    setName,
    shoppingLists,
    submitError,
  };
};
