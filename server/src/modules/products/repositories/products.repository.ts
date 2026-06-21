import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/database/prisma.service";
import type { ScrapedProduct } from "@/modules/scraping/types/scraped-product.type";
import { normalizeSearchText } from "../utils/normalize-search-text";
import {
  latestPriceQuery,
  normalizePrice,
  shouldRecordPrice,
  withCurrentPrice,
} from "../utils/current-price";

export const QUERY_TTL_MS = 6 * 60 * 60 * 1000; // 6h
const ALL_MARKETS_CACHE_SCOPE = "ALL";

const getCacheMarketSlug = (marketSlug: string | null) => marketSlug ?? ALL_MARKETS_CACHE_SCOPE;

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ingestProduct(marketId: string, product: ScrapedProduct): Promise<void> {
    await this.prisma.$transaction(async tx => {
      const scrapedAt = new Date();
      const price = normalizePrice(product.price);
      const master = await tx.masterProduct.upsert({
        where: { ean: product.ean },
        create: {
          ean: product.ean,
          name: product.name,
          imageUrl: product.imageUrl,
          brand: product.brand,
        },
        update: {
          name: product.name,
          imageUrl: product.imageUrl ?? undefined,
          brand: product.brand ?? undefined,
        },
      });
      const marketProduct = await tx.marketProduct.upsert({
        where: { marketId_sku: { marketId, sku: product.sku } },
        create: {
          sku: product.sku,
          nameInMarket: product.name,
          url: product.url,
          marketId,
          masterProductId: master.id,
          lastScrapedAt: scrapedAt,
        },
        update: {
          nameInMarket: product.name,
          url: product.url ?? undefined,
          isAvailable: true,
          masterProductId: master.id,
          lastScrapedAt: scrapedAt,
        },
      });

      await tx.$queryRaw(Prisma.sql`
        SELECT "id"
        FROM "MarketProduct"
        WHERE "id" = ${marketProduct.id}
        FOR UPDATE
      `);
      const latest = await tx.priceHistory.findFirst({
        where: { marketProductId: marketProduct.id },
        orderBy: latestPriceQuery.orderBy,
      });

      if (shouldRecordPrice(latest?.price ?? null, price)) {
        await tx.priceHistory.create({
          data: { marketProductId: marketProduct.id, price, timestamp: scrapedAt },
        });
      }
    });
  }

  async findByQuery(params: { normalizedQuery: string; marketSlugs?: string[]; ttlMs?: number }) {
    const { normalizedQuery, marketSlugs, ttlMs = QUERY_TTL_MS } = params;
    const threshold = new Date(Date.now() - ttlMs);
    const q = normalizeSearchText(normalizedQuery);
    if (!q) {
      return [];
    }

    const marketFilter =
      marketSlugs && marketSlugs.length > 0
        ? Prisma.sql`AND m."slug" IN (${Prisma.join(marketSlugs)})`
        : Prisma.empty;
    const rows = await this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT mp."id"
      FROM "MarketProduct" mp
      INNER JOIN "Market" m ON m."id" = mp."marketId"
      WHERE mp."isAvailable" = true
        AND mp."lastScrapedAt" >= ${threshold}
        AND unaccent(lower(mp."nameInMarket")) LIKE ${`%${q}%`}
        ${marketFilter}
      ORDER BY mp."lastScrapedAt" DESC
      LIMIT 200
    `);
    const ids = rows.map(row => row.id);
    if (ids.length === 0) {
      return [];
    }

    const products = await this.prisma.marketProduct.findMany({
      where: { id: { in: ids } },
      include: { market: true, masterProduct: true, history: latestPriceQuery },
    });
    const productById = new Map(products.map(product => [product.id, withCurrentPrice(product)]));
    const orderedProducts = [];
    for (const id of ids) {
      const product = productById.get(id);
      if (product) {
        orderedProducts.push(product);
      }
    }

    return orderedProducts;
  }

  async isQueryFresh(
    query: string,
    marketSlug: string | null,
    ttlMs = QUERY_TTL_MS,
  ): Promise<boolean> {
    const threshold = new Date(Date.now() - ttlMs);
    const entry = await this.prisma.searchCache.findUnique({
      where: { query_marketSlug: { query, marketSlug: getCacheMarketSlug(marketSlug) } },
    });
    return entry !== null && entry.lastScrapedAt >= threshold;
  }

  async touchQueryCache(query: string, marketSlug: string | null): Promise<void> {
    const cacheMarketSlug = getCacheMarketSlug(marketSlug);
    await this.prisma.searchCache.upsert({
      where: { query_marketSlug: { query, marketSlug: cacheMarketSlug } },
      create: { query, marketSlug: cacheMarketSlug, lastScrapedAt: new Date() },
      update: { lastScrapedAt: new Date() },
    });
  }
}
