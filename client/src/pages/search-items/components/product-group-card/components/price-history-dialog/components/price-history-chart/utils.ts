const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const axisPriceFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export const formatPrice = (price: number) => currencyFormatter.format(price);

export const formatAxisPrice = (value: string) => `R$ ${axisPriceFormatter.format(Number(value))}`;

export const formatShortDate = (timestamp: string) =>
  shortDateFormatter.format(new Date(timestamp)).replace(".", "");

export const formatFullDate = (timestamp: string) => fullDateFormatter.format(new Date(timestamp));
