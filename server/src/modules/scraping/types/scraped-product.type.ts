export interface ScrapedProduct {
  ean: string;
  sku: string;
  name: string;
  price: number;
  imageUrl?: string;
  url?: string;
  brand?: string;
}
