import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

export const PRODUCT_TTL_MS = 6 * 60 * 60 * 1000; // 6h

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findFreshByQuery(params: { q: string; marketName?: string; ttlMs?: number }) {
    const { q, marketName, ttlMs = PRODUCT_TTL_MS } = params;
    const threshold = new Date(Date.now() - ttlMs);

    return this.prisma.marketProduct.findMany({
      where: {
        isAvailable: true,
        lastScrapedAt: { gte: threshold },
        nameInMarket: { contains: q, mode: "insensitive" },
        ...(marketName ? { market: { name: marketName } } : {}),
      },
      include: { market: true, masterProduct: true },
      orderBy: { currentPrice: "asc" },
      take: 100,
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
