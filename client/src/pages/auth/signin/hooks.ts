import { getHttpErrorMessage } from "@services/http";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { signInSchema } from "./validators";
import { useState } from "react";
import { useSession } from "@contexts/session";
import { SignInPayload } from "@services/auth/types";

export const useLogin = () => {
  const {
    session: { signIn },
  } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const signInMutation = useMutation({
    mutationFn: (values: SignInPayload) => signIn(values),
    onMutate: () => {
      setSubmitError(null);
    },
    onError: async error => {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível fazer login."));
    },
  });

  const form = useForm({
    defaultValues: {
      email: "leonardo1234@gmail.com",
      password: "123456",
    },
    validators: {
      onChange: signInSchema,
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value }) => {
      await signInMutation.mutateAsync(value);
    },
  });

  return { form, signInMutation, submitError };
};
