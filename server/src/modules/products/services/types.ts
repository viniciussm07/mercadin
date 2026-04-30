import { ProductsRepository } from "../repositories/products.repository";

export type SearchProduct = Awaited<ReturnType<ProductsRepository["findByQuery"]>>[number];

export interface ProductSearchGroup {
  ean: string;
  masterProduct: SearchProduct["masterProduct"];
  items: SearchProduct[];
}

export interface ProductsSearchResponse {
  source: "cache" | "scrape";
  items: ProductSearchGroup[];
}
