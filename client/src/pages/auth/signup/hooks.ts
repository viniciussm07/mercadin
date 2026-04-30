import { authService } from "@services/auth";
import { getHttpErrorMessage } from "@services/http";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { signUpSchema } from "./validators";
import { useSession } from "@contexts/session";
import { SignUpPayload } from "@services/auth/types";

export const useSignUp = () => {
  const {
    session: { signIn },
  } = useSession();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const signUpMutation = useMutation({
    mutationFn: (values: SignUpPayload) => authService.signUp(values),
    onSuccess: (_, values) => signIn({ email: values.email, password: values.password }),
    onMutate: () => {
      setSubmitError(null);
    },
    onError: async error => {
      setSubmitError(await getHttpErrorMessage(error, "Não foi possível criar sua conta."));
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
      onDynamic: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      await signUpMutation.mutateAsync(value);
    },
  });

  return { form, signUpMutation, submitError };
};
