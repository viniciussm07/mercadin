type Rankable = { nameInMarket: string; currentPrice: number; masterProductId: string | null };

export function rankResults<T extends Rankable>(query: string, products: T[]): T[] {
  const q = query.toLowerCase().trim();
  const qTokens = q.split(/\s+/).filter(Boolean);

  const primoCount = new Map<string, number>();
  for (const p of products) {
    if (!p.masterProductId) continue;
    primoCount.set(p.masterProductId, (primoCount.get(p.masterProductId) ?? 0) + 1);
  }

  const scored = products.map(p => ({
    product: p,
    score:
      textScore(q, qTokens, p) +
      (p.masterProductId ? (primoCount.get(p.masterProductId)! - 1) * 15 : 0),
  }));

  scored.sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.product.currentPrice - b.product.currentPrice,
  );

  return scored.map(s => s.product);
}

function textScore(q: string, qTokens: string[], p: { nameInMarket: string }): number {
  const name = p.nameInMarket.toLowerCase();
  if (name === q) return 1000;

  const nTokens = name.split(/\s+/).filter(Boolean);
  let pts = 0;

  const matched = qTokens.filter(qt => nTokens.some(nt => nt === qt || nt.startsWith(qt)));
  pts += (matched.length / qTokens.length) * 60;

  let lastIdx = -1;
  let inOrder = true;
  for (const qt of qTokens) {
    const idx = nTokens.findIndex((nt, i) => i > lastIdx && (nt === qt || nt.startsWith(qt)));
    if (idx === -1) {
      inOrder = false;
      break;
    }
    lastIdx = idx;
  }
  if (inOrder && matched.length > 0) pts += 20;

  pts -= nTokens.length * 1.5;

  return pts;
}
