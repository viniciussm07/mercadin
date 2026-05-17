import { authService } from "@services/auth";
import { getHttpErrorMessage } from "@services/http";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";
import { useState } from "react";
import { updatePasswordSchema } from "../../validators";

const defaultValues = {
  currentPassword: "",
  newPassword: "",
  newPasswordConfirmation: "",
};

export const useChangePasswordDialog = () => {
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updatePassword = useMutation({
    mutationFn: authService.updatePassword,
    onMutate: () => setSubmitError(null),
    onSuccess: () => {
      showToast({ title: "Senha atualizada" });
      form.reset();
      setOpen(false);
    },
    onError: async error => {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível atualizar a senha."));
    },
  });

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: updatePasswordSchema,
      onDynamic: updatePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await updatePassword.mutateAsync(value);
    },
  });

  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset();
    }

    setSubmitError(null);
    setOpen(nextOpen);
  };

  return { form, isSubmitting: updatePassword.isPending, onOpenChange, open, submitError };
};
