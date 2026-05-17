import { useSession } from "@contexts/session";
import { authService } from "@services/auth";
import { getHttpErrorMessage } from "@services/http";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@utils/toast";
import { useState } from "react";
import { updateEmailSchema } from "../../validators";

export const useChangeEmailDialog = (currentEmail: string) => {
  const {
    session: { refetchMe },
  } = useSession();
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateEmail = useMutation({
    mutationFn: authService.updateEmail,
    onMutate: () => setSubmitError(null),
    onSuccess: async () => {
      await refetchMe();
      showToast({ title: "E-mail atualizado" });
      setOpen(false);
    },
    onError: async error => {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível atualizar o e-mail."));
    },
  });

  const form = useForm({
    defaultValues: { email: currentEmail },
    validators: {
      onSubmit: updateEmailSchema,
      onDynamic: updateEmailSchema,
    },
    onSubmit: async ({ value }) => {
      await updateEmail.mutateAsync({ email: value.email.trim() });
    },
  });

  const onOpenChange = (nextOpen: boolean) => {
    setSubmitError(null);
    setOpen(nextOpen);
  };

  return { form, isSubmitting: updateEmail.isPending, onOpenChange, open, submitError };
};
