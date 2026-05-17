import { useRemoveAllShoppingLists } from "@hooks/use-shopping-lists";
import { getHttpErrorMessage } from "@services/http";
import { useState } from "react";

export const useClearAccountDataDialog = () => {
  const removeAllShoppingLists = useRemoveAllShoppingLists();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const confirm = async () => {
    setSubmitError(null);

    try {
      await removeAllShoppingLists.mutateAsync();
      setOpen(false);
    } catch (error) {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível limpar seus dados."));
    }
  };

  return {
    confirm,
    isSubmitting: removeAllShoppingLists.isPending,
    open,
    setOpen,
    submitError,
  };
};
