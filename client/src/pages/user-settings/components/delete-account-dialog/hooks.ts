import { useSession } from "@contexts/session";
import { authService } from "@services/auth";
import { getHttpErrorMessage } from "@services/http";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";
import { useState } from "react";

export const useDeleteAccountDialog = () => {
  const { clearSession } = useSession();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const deleteAccount = useMutation({
    mutationFn: authService.deleteMe,
    onMutate: () => setSubmitError(null),
    onSuccess: async () => {
      showToast({ title: "Conta excluída" });
      setOpen(false);
      await clearSession();
    },
    onError: async error => {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível excluir sua conta."));
    },
  });

  return {
    confirm: deleteAccount.mutate,
    isSubmitting: deleteAccount.isPending,
    open,
    setOpen,
    submitError,
  };
};
