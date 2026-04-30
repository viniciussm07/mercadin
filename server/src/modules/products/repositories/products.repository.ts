import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

export const QUERY_TTL_MS = 6 * 60 * 60 * 1000; // 6h
const ALL_MARKETS_CACHE_SCOPE = "ALL";

const getCacheMarketSlug = (marketSlug: string | null) => marketSlug ?? ALL_MARKETS_CACHE_SCOPE;

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByQuery(params: { q: string; marketSlugs?: string[]; ttlMs?: number }) {
    const { q, marketSlugs, ttlMs = QUERY_TTL_MS } = params;
    const threshold = new Date(Date.now() - ttlMs);

    return this.prisma.marketProduct.findMany({
      where: {
        isAvailable: true,
        lastScrapedAt: { gte: threshold },
        nameInMarket: { contains: q, mode: "insensitive" },
        ...(marketSlugs && marketSlugs.length > 0 ? { market: { slug: { in: marketSlugs } } } : {}),
      },
      include: { market: true, masterProduct: true },
      take: 200,
    });
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
