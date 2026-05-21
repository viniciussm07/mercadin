const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  style: "currency",
});

export const formatCurrency = (value: number) => currencyFormatter.format(value);

export const itemCountLabel = (count: number) => `${count} ${count === 1 ? "item" : "itens"}`;

export const marketCountLabel = (count: number) =>
  `${count} ${count === 1 ? "mercado" : "mercados"}`;

export const formatMissingPreview = (items: string[]) => {
  if (items.length === 0) {
    return "Lista completa";
  }

  const visibleItems = items.slice(0, 2).join(", ");
  const remainingCount = items.length - 2;

  if (remainingCount <= 0) {
    return visibleItems;
  }

  return `${visibleItems} e mais ${remainingCount}`;
};
