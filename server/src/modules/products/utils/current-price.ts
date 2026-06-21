export const latestPriceQuery = {
  orderBy: [{ timestamp: "desc" as const }, { id: "desc" as const }],
  take: 1,
  select: { price: true },
};

export const normalizePrice = (price: number): number =>
  Math.round((price + Number.EPSILON) * 100) / 100;

export const shouldRecordPrice = (latestPrice: number | null, scrapedPrice: number): boolean =>
  latestPrice === null || normalizePrice(latestPrice) !== normalizePrice(scrapedPrice);

export const readCurrentPrice = (product: { history: { price: number }[] }): number => {
  const latest = product.history[0];
  if (!latest) {
    throw new Error("Market product has no price history");
  }

  return normalizePrice(latest.price);
};

export const withCurrentPrice = <T extends { history: { price: number }[] }>(
  product: T,
): Omit<T, "history"> & { currentPrice: number } => {
  const { history, ...data } = product;
  return { ...data, currentPrice: readCurrentPrice({ history }) };
};
