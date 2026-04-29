import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

export const QUERY_TTL_MS = 6 * 60 * 60 * 1000; // 6h

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByQuery(params: { q: string; marketNames?: string[] }) {
    const { q, marketNames } = params;

    return this.prisma.marketProduct.findMany({
      where: {
        isAvailable: true,
        nameInMarket: { contains: q, mode: "insensitive" },
        ...(marketNames && marketNames.length > 0 ? { market: { name: { in: marketNames } } } : {}),
      },
      include: { market: true, masterProduct: true },
      orderBy: { currentPrice: "asc" },
      take: 100,
    });
  }

  async isQueryFresh(
    query: string,
    marketSlug: string | null,
    ttlMs = QUERY_TTL_MS,
  ): Promise<boolean> {
    const threshold = new Date(Date.now() - ttlMs);
    const entry = await this.prisma.searchCache.findFirst({
      where: { query, marketSlug },
    });
    return entry !== null && entry.lastScrapedAt >= threshold;
  }

  async touchQueryCache(query: string, marketSlug: string | null): Promise<void> {
    const existing = await this.prisma.searchCache.findFirst({
      where: { query, marketSlug },
    });
    if (existing) {
      await this.prisma.searchCache.update({
        where: { id: existing.id },
        data: { lastScrapedAt: new Date() },
      });
    } else {
      await this.prisma.searchCache.create({
        data: { query, marketSlug, lastScrapedAt: new Date() },
      });
    }
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
