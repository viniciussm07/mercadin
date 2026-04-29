import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import type { IMarketScraper } from "../interfaces/market-scraper.interface";
import type { ScrapedProduct } from "../types/scraped-product.type";
import { MARKET_SLUGS } from "@/common/constants/market-slugs.constant";

const BASE_URL = "https://www.tendaatacado.com.br";
const SEARCH_PATH = "/busca";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

@Injectable()
export class TendaAtacadoScraper implements IMarketScraper {
  readonly marketSlug = MARKET_SLUGS.TENDA_ATACADO;
  readonly marketName = "Tenda Atacado";
  readonly marketUrl = BASE_URL;

  async search(query: string): Promise<ScrapedProduct[]> {
    const url = `${BASE_URL}${SEARCH_PATH}?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });
    if (!res.ok) {
      throw new Error(`Tenda Atacado search failed (${res.status}) for query "${query}"`);
    }
    const html = await res.text();
    return this.parse(html);
  }

  private parse(html: string): ScrapedProduct[] {
    const $ = cheerio.load(html);
    const nextDataRaw = $("#__NEXT_DATA__").html();
    if (!nextDataRaw) {
      throw new Error("Missing Tenda Atacado __NEXT_DATA__ payload");
    }

    let nextData: unknown;
    try {
      nextData = JSON.parse(nextDataRaw);
    } catch {
      throw new Error("Failed to parse Tenda Atacado __NEXT_DATA__ JSON");
    }

    const props = isRecord(nextData) ? nextData.props : undefined;
    const initialMobxState = isRecord(props) ? props.initialMobxState : undefined;
    const productStore = isRecord(initialMobxState) ? initialMobxState.productStore : undefined;
    const rawProducts = isRecord(productStore) ? productStore.productByPage : undefined;

    if (!Array.isArray(rawProducts)) {
      throw new Error("Unexpected Tenda Atacado product payload");
    }

    const products: ScrapedProduct[] = [];
    for (const p of rawProducts) {
      if (!isRecord(p)) continue;

      const name = typeof p.name === "string" ? p.name.trim() : "";
      if (!name) continue;

      const price = Number(p.price);
      if (!Number.isFinite(price) || price <= 0) continue;

      const ean = String(p.barcode ?? "").trim();
      if (!ean || !/^\d{8,14}$/.test(ean)) continue;

      const sku = typeof p.sku === "string" ? p.sku : ean;
      const imageUrl = typeof p.thumbnail === "string" ? p.thumbnail : undefined;
      const productUrl =
        typeof p.url === "string"
          ? p.url.startsWith("http")
            ? p.url
            : `${BASE_URL}${p.url}`
          : undefined;

      products.push({
        ean,
        sku,
        name,
        price,
        imageUrl,
        url: productUrl,
        brand: typeof p.brand === "string" ? p.brand.trim() || undefined : undefined,
      });
    }
    return products;
  }
}
