export interface PriceComparisonPick {
  masterProductId: string;
  masterProductName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ByMarketCart {
  marketId: string;
  marketName: string;
  total: number;
  isComplete: boolean;
  missing: string[];
  picks: PriceComparisonPick[];
}

export interface SuperCartPick extends PriceComparisonPick {
  marketId: string;
  marketName: string;
}

export interface SuperCart {
  total: number;
  marketsCount: number;
  isComplete: boolean;
  picks: SuperCartPick[];
  missing: string[];
}

export interface PriceComparison {
  listId: string;
  byMarket: ByMarketCart[];
  superCart: SuperCart;
  cheapestSingleMarketId: string | null;
  savings: number | null;
}

export interface FindPriceComparisonParams {
  listId: string;
  signal?: AbortSignal;
}
