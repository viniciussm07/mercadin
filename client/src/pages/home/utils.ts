export const formatUpdatedAt = (updatedAt?: string) => {
  if (!updatedAt) {
    return "Atualizada recentemente";
  }

  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Atualizada recentemente";
  }

  return `Atualizada em ${new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(date)}`;
};

export const getFirstName = (name?: string | null) => {
  if (!name) {
    return "de volta";
  }

  return `de volta, ${name.split(" ")[0]}`;
};
