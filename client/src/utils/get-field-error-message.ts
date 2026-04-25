import { StandardSchemaV1Issue } from "@tanstack/react-form";

export const getFieldErrorMessage = (errors: (StandardSchemaV1Issue | undefined)[]) => {
  const firstError = errors[0];

  if (firstError) {
    return firstError.message;
  }

  return null;
};
