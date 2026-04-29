import { MarketProduct } from "@services/products";

export interface ProductGroup {
  ean: string;
  masterProduct: MarketProduct["masterProduct"];
  offers: MarketProduct[];
}
