export const getFieldErrorMessage = (errors: unknown[]) => {
  const firstError = errors[0];

  if (typeof firstError === "string") {
    return firstError;
  }

  if (firstError instanceof Error) {
    return firstError.message;
  }

  return null;
};
