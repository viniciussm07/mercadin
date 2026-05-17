import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";

const SEARCH_HISTORY_LIMIT = 10;

@Injectable()
export class ProductSearchHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  findRecent(userId: string, limit = SEARCH_HISTORY_LIMIT) {
    return this.prisma.productSearchHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
    });
  }

  async save(userId: string, query: string, normalizedQuery: string) {
    const entry = await this.prisma.productSearchHistory.upsert({
      where: { userId_normalizedQuery: { userId, normalizedQuery } },
      create: { userId, query, normalizedQuery },
      update: { query, updatedAt: new Date() },
    });

    await this.deleteOverflow(userId);

    return entry;
  }

  private async deleteOverflow(userId: string) {
    const overflow = await this.prisma.productSearchHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      skip: SEARCH_HISTORY_LIMIT,
      select: { id: true },
    });

    if (overflow.length === 0) {
      return;
    }

    await this.prisma.productSearchHistory.deleteMany({
      where: { id: { in: overflow.map(entry => entry.id) } },
    });
  }
}
