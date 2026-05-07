import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "@/database/prisma.service";
import { normalizeSearchText } from "../utils/normalize-search-text";

export const QUERY_TTL_MS = 6 * 60 * 60 * 1000; // 6h
const ALL_MARKETS_CACHE_SCOPE = "ALL";

const getCacheMarketSlug = (marketSlug: string | null) => marketSlug ?? ALL_MARKETS_CACHE_SCOPE;

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      include: { market: true, masterProduct: true },
    });
    const productById = new Map(products.map(product => [product.id, product]));
    const orderedProducts: typeof products = [];
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

  findAll() {
    return this.prisma.masterProduct.findMany({
      include: {
        variants: {
          include: {
            market: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  }
}
